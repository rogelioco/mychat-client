export interface AuthData{
    userId: String,
    token: String
}

export interface User{
    _id: String,
    userName: String,
    password: String,
    profilePic: String,
}

export interface UserInput{
    userName: String,
    password: String,
    profilePic: String,
}

export interface Chat{
    _id: String,
    nameChat: String,
    creationDate: String,
    owner: User,
    guest: [User],
    key: String,
    shared: String,
    favoriteMessages: [String],
    bookmarks: [Bookmark]
    messageUsers: String[]
    viewAs: String
}

export interface ChatInput{
    nameChat: String,
    creationDate: String,
    owner: String,
    messageUsers: String[]
    viewAs: String
}

export interface Message{
    _id: String;
    date: String;
    time: String;
    user: String;
    body: String;
    favorite: boolean;
    chat: [Chat];
}

export interface MessageInput{
    date: String;
    time: String;
    user: String;
    body: String;
    chat: String;
}

export interface Bookmark{
    _id: String,
    user: User,
    message: Message,
    index: number
}

export interface BookmarkInput{
    user: String,
    message: String,
    index: number
}

export interface Alert{
    status: boolean,
    message: String,
}