
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { Chat, ChatInput, MessageInput, Message } from 'src/app/shared/interfaces/data.interface';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private route: ActivatedRoute, private data: DataService, private cookieService: CookieService, private router: Router) {}

  chat$: Observable<Chat | ChatInput>;
  messages$: Observable<Message[] | MessageInput[]>;
  idUser = this.cookieService.get('user');

  isOnline = false;
  im: String;


  permission: boolean = false;
  id;
  existMoreMessages = true;
  pageNumber = 0;

  idMessage;

  ngOnInit() {

    this.route.paramMap.subscribe(async (paramMap) => {
      const param = paramMap.get('id');
      if (param != null) {
        this.isOnline = true;
        this.data.chatById(param);
        this.chat$ = this.data.chat$;
        let chatOnline$ = this.data.chat$;
        
        chatOnline$.subscribe( res => {
          if(res != null) {
            res.bookmarks.forEach(bookmark => {
              if(bookmark.user._id == this.idUser) {
                this.pageNumber = bookmark.index;
                this.data.messageById(param, 0, this.pageNumber);
              }
            })
          }
        })
        this.messages$ = this.data.messages$
        this.data.idChat$.subscribe((res) => this.id = res);
        chatOnline$.subscribe(res => {
          if (res != null) {
            if (res.owner._id == this.idUser) {
              this.permission = true;
            } else {
              this.router.navigate(['/login']);
            }
          }
        })

      } else {
        //offline mode
        this.isOnline = false;
        this.chat$ = this.data.chatOffline$;
        this.messages$ = this.data.messagesInput$;
        this.chat$.subscribe( chat => {
          if(chat == null) {
            this.router.navigate(['/home']);
          }
        })
      }
    })
  }

  addOrRemoveFavorite(favorite: boolean, idMessage: String) {
    if (favorite) {
      if (this.permission)
        this.data.updateFavorite(idMessage, false);
    } else {
      this.data.updateFavorite(idMessage, true);
    }
  }

  returnTop() {
    let el = document.getElementById('messageHistory');
    el.scrollTop = 0;
  }

  returnBottom() {
    let el = document.getElementById('messageHistory');
    el.scrollTop = el.scrollHeight;
  }

  upload() {
    if(this.cookieService.check('user')) {
      let chat;
      let messages;
      this.chat$.subscribe(async res => chat = res);
      this.messages$.subscribe(async res => messages = res);
      this.data.uploadChat(chat, messages);
    } else {
      this.router.navigate(['/login']);
    }
   
  }

  readMore() {
    this.data.loadMoreMessages(this.pageNumber, this.id);
    this.pageNumber += 50;
  }

  updateBookmark(_idMessage: String) {
    if (this.isOnline) {
      this.idMessage = _idMessage;
    }
  }

  updateIndex() {
    let chatTemp$ = this.data.chat$;
    chatTemp$.subscribe(res => {
      res.bookmarks.forEach(bookmark => {
        if (bookmark.user._id == this.idUser) {
          this.data.updateBookmark(bookmark, this.idMessage, this.pageNumber);
        }
      })
    })

    this.chat$ = this.data.chat$;
  }

  ngOnDestroy() {
    this.isOnline = false;
  }

}