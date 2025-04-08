export interface User {
    id: string;
    username: string;
}

export interface Message {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
}