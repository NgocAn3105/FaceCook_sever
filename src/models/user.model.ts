export interface User {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
    create_at: Date;
    birth: Date;
    isadmin: number;
    status: number;
}
export interface HistoryMessage {
    sender_id: number,
    receiver_id: number,
    content: string,
    created_at: Date;
    status: string;
}


export interface Response_return {
    status: number;
    message: string | null;
}
export interface Login_return {
    status: number;
    message: string;
    access_token: string;
    refresh_token: string;
    secret_key: string;
}
