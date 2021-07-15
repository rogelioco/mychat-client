import gql from 'graphql-tag';

export const login = gql`
    mutation login($userName: String!, $password: String!) {
        login(userName: $userName, password: $password) {
            userId
            token
        }
    }
`;

export const createUser = gql`
    mutation createUser($input: UserInput!) {
        createUser(input: $input) {
            _id
            userName
        }
    }

`;

export const chatById = gql`
    query chat($_id: ID) {
        chat(_id: $_id) {
            _id
            nameChat
            viewAs
            owner {
                _id
                userName
            }
            messageUsers
            shared
            guest {
                _id
                userName
            }
            bookmarks {
                _id
                user {
                    _id
                }
                message {
                    _id
                }
                index
            }
        }
    }
`;

export const message = gql`
    query message($_id: ID) {
        message(_id: $_id) {
            favorite
        }
    }
`;

export const messagesById = gql`
    query messagesById($_idChat: ID, $offset: Int, $limit: Int) {
        messagesById(_idChat: $_idChat, offset: $offset, limit: $limit) {
            _id
            date
            time
            user
            body
            favorite
        }
    }
`;

export const chatsByOwner = gql` 
    query chatsByOwner($_idOwner: ID) {
        chatsByOwner(_idOwner: $_idOwner) {
            _id
            nameChat
            creationDate
            owner {
                userName
            }
            guest {
                _id
                userName
            }
            bookmarks{
                _id
                message {
                    _id
                    body
                    user
                }
                user {
                    _id
                }
            }
        }
    }

    
`;

export const chatsByInvitation = gql` 
    query chatsByInvitation($_idOwner: ID) {
        chatsByInvitation(_idOwner: $_idOwner) {
            _id
            nameChat
            creationDate
            owner {
                userName
            }
            guest {
                _id
                userName
            }
            bookmarks{
                _id
                message {
                    _id
                    body
                    user
                }
                user {
                    _id
                }
            }
        }
    }

    
`;


export const bookmarksByOwner = gql`
    query bookmarksByOwner($_idOwner: ID!) {
        bookmarksByOwner(_idOwner: $_idOwner){
            _id
            message {
                _id
                body
            }
        }
    }
`;

export const userById = gql`
    query user($_id: ID) {
        user(_id: $_id) {
            _id
            userName
        }
    }

`;

export const createMessage = gql`
    mutation createMessage($input: MessageInput!) {
        createMessage(input: $input) {
            _id
        }
    }
`;


export const createChat = gql`
    mutation createChat($input: ChatInput!) {
        createChat(input: $input) {
            _id
        }
    }
`;

export const setMessage = gql`
    mutation setMessage($_idChat: ID!, $_idMessage: ID!) {
        setMessage(_idChat: $_idChat, _idMessage: $_idMessage) {
            _id
            nameChat
            messages {
                _id
                body
            }
        }
    }
`;

export const messagesArray = gql`
    mutation messagesArray($input: [MessageInput]) {
        messagesArray(input: $input) {
            _id
            owner {
                _id
            }
        }
    }
`;

export const updateUser = gql`
    mutation updateUser($_id: ID!, $input: UserInput) {
        updateUser(_id: $_id, input: $input) {
            _id
            userName
        }
    }
`;

export const userByUserName = gql`
    query userByUserName($username: String) {
        userByUserName(username: $username) {
            _id
            userName
        }
    }
`;

export const addGuest = gql`
    mutation addGuest($_idChat: ID!, $_idUser: ID!) {
        addGuest(_idChat: $_idChat, _idUser: $_idUser) {
            _id
            guest {
                _id
            }
            bookmarks {
                user {
                    _id
                }
            }
        }
    }
`;

export const removeGuest = gql`
    mutation removeGuest($_idChat: ID!, $_idUser: ID!) {
        removeGuest(_idChat: $_idChat, _idUser: $_idUser) {
            _id
            guest {
                _id
                userName
            }
        }
    }
`;

export const updateFavorite = gql`
    mutation updateFavorite($_idMessage: ID, $input: Boolean) {
        updateFavorite(_idMessage: $_idMessage, input: $input) {
            _id
            favorite
        }
    }
`;

export const updateShared = gql`
    mutation uupdateShared($_idChat: ID!) {
        updateShared(_idChat: $_idChat) {
            _id
        }
    }
`;

export const firstMessageByChat = gql`
query messagesById($_idChat: ID, $offset: Int, $limit: Int) {
    messagesById(_idChat: $_idChat, offset: $offset, limit: $limit) {
        _id
    }
}
`;

export const createBookmark = gql`
    mutation createBookmark($input: BookmarkInput) {
        createBookmark(input: $input) {
            _id
        }
    }

`;

export const setBookmark = gql`
    mutation setBookmark($_idChat: ID!, $_idBookmark: ID!) {
        setBookmark(_idChat: $_idChat, _idBookmark: $_idBookmark) {
            _id
        }
    }
`;

export const messagesFavorites = gql`
    query messagesFavorites($_idChat: ID) {
        messagesFavorites(_idChat: $_idChat) {
            _id
            date
            time
            user
            body
            favorite
            chat {
                _id
            }
        }
    }
`;

export const updateChat = gql`
    mutation updateChat($_id: ID, $nameChat: String, $viewAs: String) {
        updateChat(_id: $_id, nameChat: $nameChat, viewAs: $viewAs) {
            _id
        }
    }
`;

export const updateBookmark = gql`
    mutation updateBookmark($_id: ID!, $_idMessage: ID!, $index: Int) {
        updateBookmark(_id: $_id, _idMessage: $_idMessage, index: $index) {
            _id
        }
    }
`;