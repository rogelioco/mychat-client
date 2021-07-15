import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { Chat } from 'src/app/shared/interfaces/data.interface';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-favorites-options',
  templateUrl: './favorites-options.component.html',
  styleUrls: ['./favorites-options.component.css']
})
export class FavoritesOptionsComponent implements OnInit {

  constructor(private data: DataService, private cookieService: CookieService, private route: ActivatedRoute) {}
  messages$ = this.data.message$;
  chat$ = this.data.chat$;
  user$ = this.data.user$;
  idUser = this.cookieService.get('user');
  idChat: String;
  page = 0;

  newUserName: String;
  newPassword: String;

  newNameChat: String;
  addUser: String;
  im: String;
  permission: boolean = false;

  ngOnInit(): void{
    this.route.paramMap.subscribe( async (paramMap) => {
      this.data.userById(this.idUser);
      this.idChat = paramMap.get('id');
      this.data.chatById(this.idChat);
      this.page+=10;

      this.chat$.subscribe(res => {
        if(res!=null) {
          if(res.owner._id == this.idUser) {
            this.permission = true;
          }
        }
      });
    })

    this.data.messagesFavorites(this.idChat);
  }
  

  addOrRemoveFavorite(favorite: boolean, idMessage: String){
    if(favorite) {
      if(this.permission) {
        this.data.updateFavorite(idMessage, false);
      }
       
    } else {
      this.data.updateFavorite(idMessage, true);
    }
  }

  updateUser(){
    if(this.newPassword != null && this.newUserName != null) {
      this.data.updateUser(this.idUser, this.newUserName, this.newPassword);
    }
  }

  updateShared() {
    this.data.updateShared(this.idChat);
    window.location.reload();
  }

  addUserToChat() {
    if(this.addUser != null) {
      this.data.addGuest(this.idChat, this.addUser);
    }
      
  }

  saveChange() {
    if(this.newNameChat == null) {
      this.chat$.subscribe(res=> this.newNameChat = res.nameChat);
    }
    
    if(this.im == null) {
      this.chat$.subscribe(res=> this.im = res.viewAs);
    }
    this.chat$.subscribe(res => {
      this.data.updateChat(res._id,this.newNameChat, this.im);
    })
    
  }

  removeUser(id) {
    this.data.removeGuest(this.idChat, id);
  }

}
