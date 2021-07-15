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

    if(this.id == null) {
      this.isEmpty = true;
    }
  }

}
