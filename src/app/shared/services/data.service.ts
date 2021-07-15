import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, merge } from 'rxjs';
import * as Query from './graphql/query.model';
import { Alert, AuthData, Bookmark, BookmarkInput, Chat, ChatInput, Message, MessageInput, User, UserInput } from '../interfaces/data.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { pluck, take, withLatestFrom, tap } from 'rxjs/operators'
import { Observable } from '@apollo/client/utilities';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private authDataSubject = new BehaviorSubject<AuthData>(null);
  authData$ = this.authDataSubject.asObservable();

  private chatsSubject = new BehaviorSubject<Chat[]>(null);
  chats$ = this.chatsSubject.asObservable();

  private chatOfflineSubject = new BehaviorSubject<ChatInput>(null);
  chatOffline$ = this.chatOfflineSubject.asObservable();

  private chatSharedSubject = new BehaviorSubject<Chat[]>(null);
  chatsShared$ = this.chatSharedSubject.asObservable();

  private userSubject = new BehaviorSubject<User>(null);
  user$ = this.userSubject.asObservable();

  private alertSubject = new BehaviorSubject<Alert>(null);
  alert$ = this.alertSubject.asObservable();

  private bookmarkSubject = new BehaviorSubject<Bookmark>(null);
  bookmark$ = this.bookmarkSubject.asObservable();

  private chatSubject = new BehaviorSubject<Chat>(null);
  chat$ = this.chatSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>(null);
  messages$ = this.messagesSubject.asObservable();

  private messagesInputSubject = new BehaviorSubject<MessageInput[]>(null);
  messagesInput$ = this.messagesInputSubject.asObservable();

  private messageSubject = new BehaviorSubject<Message>(null);
  message$ = this.messageSubject.asObservable();

  private idChatSubject = new BehaviorSubject<String>(null);
  idChat$ = this.idChatSubject.asObservable();

  constructor(private apollo: Apollo, private cookieService: CookieService, private router: Router) {
    this.alertSubject.next({ status: false, message: '' });
  }

  login(userName, password) {
    this.apollo.mutate<AuthData>({
      mutation: Query.login,
      variables: {
        userName: userName,
        password: password
      },
      errorPolicy: 'all'
    }).subscribe(res => {

      if (res.errors != null) {
        const err = res.errors[0].message;
        this.alertSubject.next({ status: true, message: err })
      }

      if (res.data['login'] != null) {
        this.authDataSubject.next(res.data['login']);
        this.cookieService.set('token', res.data['login'].token);
        this.cookieService.set('user', res.data['login'].userId);
        this.alertSubject.next({ status: false, message: '' });
        this.userSubject.next(null);
        this.router.navigate(['/chats'])
      }
    })
  }

  async register(userName, password) {

    this.apollo.mutate<User>({
      mutation: Query.createUser,
      variables: {
        input: {
          userName: userName,
          password: password,
          profilePic: 'n/a'
        }
      },
      errorPolicy: 'all'
    }).subscribe(res => {
      if (res.errors != null) {
        const err = res.errors[0].message;
        this.alertSubject.next({ status: true, message: err })
      }

      if (res.data['createUser'] != null) {
        this.userSubject.next(res.data['createUser']);
        this.router.navigate(['/login'])
      }
    })
  }

  userById(id) {
    this.apollo.watchQuery<User>({
      query: Query.userById,
      variables: {
        _id: id
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.userSubject.next(data['user']);
    })
  }


  mergeMessages(messages: Message[]) {
    this.messagesSubject.next(messages);
  }

  loadMoreMessages(offset: number, id) {
    this.apollo.watchQuery<Message>({
      query: Query.messagesById,
      variables: {
        _idChat: id,
        limit: 10,
        offset: offset
      },
      errorPolicy: 'all'
    }).valueChanges.pipe(
      take(1),
      pluck<Message[], Message[]>('data'),
      withLatestFrom(this.messages$),
      tap(([apiResponse, messages]) => {
        this.mergeMessages([...messages, ...apiResponse['messagesById']]);
      })
    ).subscribe();
  }

  messageById(id: String, offset: number, limit: number) {
    this.apollo.watchQuery<Message[]>({
      query: Query.messagesById,
      variables: {
        _idChat: id,
        limit: limit,
        offset: offset
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.messagesSubject.next(data['messagesById']);
    })
  }

  chatById(id: String) {
    this.apollo.watchQuery<Chat>({
      query: Query.chatById,
      variables: {
        _id: id
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.chatSubject.next(data['chat']);
    })
    this.idChatSubject.next(id);
  }

  chatsByOwer(id) {
    this.apollo.watchQuery<Chat[]>({
      query: Query.chatsByOwner,
      variables: {
        _idOwner: id
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.chatsSubject.next(data['chatsByOwner']);
    });
  }

  chatsByInvitation(id) {
    this.apollo.watchQuery<Chat[]>({
      query: Query.chatsByInvitation,
      variables: {
        _idOwner: id
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.chatSharedSubject.next(data['chatsByInvitation']);
    });
  }

  bookmarksByOwner(id) {
    this.apollo.watchQuery<Bookmark[]>({
      query: Query.bookmarksByOwner,
      variables: {
        _idOwner: id
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.bookmarkSubject.next(data['bookmarksByOwner']);
    })
  }


  test(messages: MessageInput[]) {
    let id: String;
    this.idChat$.subscribe(async res => id = res);
    messages.map(message => message.chat = id);


    this.apollo.mutate<Chat>({
      mutation: Query.messagesArray,
      variables: {
        input: messages,
      },
      errorPolicy: 'all'
    }).subscribe(({ data }) => {
      this.createBookMark(data['messagesArray']._id, data['messagesArray'].owner._id);
      this.router.navigate(['/chat', data['messagesArray']._id]);
    })
  }

  createBookMark(idChat, idOwner) {
    this.apollo.watchQuery<Message>({
      query: Query.firstMessageByChat,
      variables: {
        _idChat: idChat,
        offset: 0,
        limit: 1
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.apollo.mutate<BookmarkInput>({
        mutation: Query.createBookmark,
        variables: {
          input: {
            user: idOwner,
            message: data['messagesById'][0]._id
          }
        },
        errorPolicy: 'all'
      }).subscribe(({ data }) => {
        this.apollo.mutate<Chat>({
          mutation: Query.setBookmark,
          variables: {
            _idChat: idChat,
            _idBookmark: data['createBookmark']._id
          },
          errorPolicy: 'all'
        }).subscribe();

      })
    })
  }

  chatOffline(messages: MessageInput[], nameChat: String, users: String[], im: String) {
    let chat: ChatInput = {
      creationDate: new Date().toLocaleDateString(),
      messageUsers: users,
      nameChat: nameChat,
      owner: 'Offline',
      viewAs: im,
    }

    if (this.cookieService.check('user')) {
      chat.owner = this.cookieService.get('user');
    }


    this.messagesInputSubject.next(messages);
    this.chatOfflineSubject.next(chat);
    this.router.navigate(['/chat-offline'])
  }


  uploadChat(chat: ChatInput, messagesInput: MessageInput[]) {
    this.apollo.mutate<ChatInput>({
      mutation: Query.createChat,
      variables: {
        input: chat
      },
      errorPolicy: 'all'
    }).subscribe(async ({ data }) => {
      let id = await data['createChat']._id;
      this.idChatSubject.next(id);
      this.test(messagesInput)
    });
  }


  updateUser(id, username, password) {
    let user: UserInput = {
      userName: username,
      password: password,
      profilePic: 'n/a'
    }
    this.apollo.mutate<User>({
      mutation: Query.updateUser,
      variables: {
        _id: id,
        input: user
      }
    }).subscribe();
  }

  addGuest(idChat, user) {
    let _idUser;
    this.apollo.watchQuery<User>({
      query: Query.userByUserName,
      variables: {
        username: user
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      if (data['userByUserName'] != null) {
        _idUser = data['userByUserName']._id;
        this.apollo.mutate<Chat>({
          mutation: Query.addGuest,
          variables: {
            _idChat: idChat,
            _idUser: _idUser
          },
          errorPolicy: 'all'
        }).subscribe(async ({ data }) => {
          if (!data['addGuest'].bookmarks.includes({ user: _idUser })) {
            this.createBookMark(idChat, _idUser);

          }
        })
      }

    })
  }

  removeGuest(idChat, user) {
    this.apollo.mutate<Chat>({
      mutation: Query.removeGuest,
      variables: {
        _idChat: idChat,
        _idUser: user
      }
    }).subscribe();
  }

  resetAlert() {
    this.alertSubject.next({ status: false, message: '' })
  }

  updateFavorite(idMessage, input) {
    this.apollo.mutate<Message>({
      mutation: Query.updateFavorite,
      variables: {
        _idMessage: idMessage,
        input: input
      },
      errorPolicy: 'all'
    }).subscribe();
  }

  updateShared(_idChat) {
    this.apollo.mutate<Chat>({
      mutation: Query.updateShared,
      variables: {
        _idChat: _idChat
      },
      errorPolicy: 'all'
    }).subscribe();
  }

  messagesFavorites(_idChat) {
    this.apollo.watchQuery<Message[]>({
      query: Query.messagesFavorites,
      variables: {
        _idChat: _idChat
      },
      errorPolicy: 'all'
    }).valueChanges.subscribe(({ data }) => {
      this.messageSubject.next(data['messagesFavorites']);
    })
  }

  updateChat(_idChat, nameChat, viewAs) {
    this.apollo.mutate<Chat>({
      mutation: Query.updateChat,
      variables: {
        _id: _idChat,
        nameChat: nameChat,
        viewAs: viewAs
      },
      errorPolicy: 'all'
    }).subscribe();
  }

  updateBookmark(bookmark: Bookmark, _idMessage: String, index: number) {
    this.apollo.mutate<Bookmark>({
      mutation: Query.updateBookmark,
      variables: {
        _id: bookmark._id,
        _idMessage: _idMessage,
        index: index
      },
      errorPolicy: 'all'
    }).subscribe();
  }
}