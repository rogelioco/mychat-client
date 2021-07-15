import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UploadFileComponent } from './components/pages/upload-file/upload-file.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarModule } from './shared/components/navbar/navbar.module';
import { ChatsListComponent } from './components/pages/chats-list/chats-list.component';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ChatComponent } from './components/pages/chat/chat.component';
import { JwtInterceptorInterceptor } from './jwt-interceptor.interceptor';
import { RegisterComponent } from './components/pages/register/register.component';
import { FavoritesOptionsComponent } from './components/pages/favorites-options/favorites-options.component';
@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    HomeComponent,
    ChatsListComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    FavoritesOptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    NavbarModule,
    FormsModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
