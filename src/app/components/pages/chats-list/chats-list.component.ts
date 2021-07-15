import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Bookmark } from 'src/app/shared/interfaces/data.interface';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent implements OnInit {
  id = this.cookieService.get('user');
  chats$ = this.data.chats$;
  chatsShared$ = this.data.chatsShared$;

  isEmpty = false;

  constructor(private data: DataService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.data.chatsByOwer(this.id);
    this.data.chatsByInvitation(this.id);

    this.chats$.subscribe( chat => {
      this.chatsShared$.subscribe( chatShared => {
        console.log(chat);
        console.log(chatShared);
        if(chat != null  && chatShared != null) {
          if(chat.length <= 0 && chatShared.length <= 0) {
            this.isEmpty = true;
          }
        }
      })
    })
  }

}
