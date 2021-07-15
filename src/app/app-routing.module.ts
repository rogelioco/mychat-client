import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UploadFileComponent } from './components/pages/upload-file/upload-file.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ChatsListComponent } from './components/pages/chats-list/chats-list.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { UserGuardGuard } from './user-guard.guard';
import { RegisterComponent } from './components/pages/register/register.component';
import { FavoritesOptionsComponent } from './components/pages/favorites-options/favorites-options.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'upload-file',
    component: UploadFileComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'chats',
    component: ChatsListComponent,
    canActivate: [UserGuardGuard]
  },
  {
    path: 'chat/:id',
    component: ChatComponent,
    canActivate: [UserGuardGuard]
  },
  {
    path: 'chat-offline',
    component: ChatComponent,
  },
  {
    path: 'favorites-options/:id',
    component: FavoritesOptionsComponent,
    canActivate: [UserGuardGuard]
  },
  {
    path: 'sign-up',
    component: RegisterComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
