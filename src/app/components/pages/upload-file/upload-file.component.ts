
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { Message } from 'src/models/message.model';

let data: string = '';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  messages: Message[] = new Array();
  dateTimeRegex = /\d+\/\d+\/\d+ \d+:\d{2} \w\.\sm\./g; /*/\d{2}\/\d{2}\/\d{2} \d+:\d{2} \w\.\sm\./g*/  
  userRegex = / - [\w [$&+,;=?@#|'<>.^*()%!\-À-ȕ]+: /g;
  dateRegex = /\d+\/\d+\/\d+/g
  timeRegex = /\d+:\d{2} \w\.\sm\./g

  disabled = true;
  users: String[] = new Array();
  im: String;
  nameChat: String;

  constructor(private dataService: DataService, private router: Router) {

  }

  ngOnInit(): void {
  }


  readFile(fileList: FileList): void{
    this.disabled = true;
    let file = fileList[0];
    if(file != null) {
      let fileReader: FileReader = new FileReader();
      let self: string;
      fileReader.onload = function () {
        data = fileReader.result.toString();
      }
      fileReader.readAsText(file, 'utf8');      
    } else {
      //error
    }
    this.disabled = true;
  }
  
  processFile() {
    let messages: string[] = new Array();
    if(data != '') {
      let dataSplit = data.split(/\n/g);
      for(const d of dataSplit) {
        if(d.match(this.dateTimeRegex)){
          messages.push(d);
        } else {
          messages[messages.length-1] = messages[messages.length-1] + d;
        }
      }
      this.formatFile(messages);
    }
  }

  formatFile(messages) {
    for(const m of messages) {
      try {
        let dateTemp = m.match(this.dateTimeRegex).toString();
        let date = dateTemp.match(this.dateRegex).toString();
        let time = dateTemp.match(this.timeRegex).toString();
        let user = m.match(this.userRegex)?m.match(this.userRegex).toString() : 'WhatsApp';
        let body = m.replace(this.dateTimeRegex, '').replace(this.userRegex, '').toString();

        let message: Message = new Message;

        message.date = date;
        message.time = time.replace(' ', '');
        message.user = user.replace(' - ', '').replace(': ', '').toString();
        message.body = body;
        message.chat = 'Offline';
      
        this.messages.push(message);

        if(!this.users.includes(message.user) && message.user != 'WhatsApp') {
          this.users.push(message.user);
        }

      } catch(error) {
      }
      
      
    }
    this.disabled=false;
  }

  sendChat() {
    if(this.im == undefined) {
      this.im = this.users[0];
    }
    if(this.nameChat == undefined) {
      this.nameChat = this.users[0]+"'s chat";
    }
    this.dataService.chatOffline(this.messages, this.nameChat, this.users, this.im);
  }

  ngOnDestroy() {
    this.disabled = true;
  }
}
