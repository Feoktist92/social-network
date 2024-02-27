// Тип данных для пользователя
export type User = {
    id: number;
    username: string;
    password: string;
    fullName: string;
    email: string;
    avatar?: string;
    friends?: User[];
    posts?: Post[];
    incomingMessages?: Message[];
    outgoingMessages?: Message[];
    token?: string;
};

// Тип данных для комментария
export type Comment = {
    id: number;
    postId: number;
    author: string;
    content: string;
};

// Тип данных для поста
export type Post = {
    id: number;
    title: string;
    content: string;
    comments: Comment[];
};

// Тип данных для сообщения
export type Message = {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
};
