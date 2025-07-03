export interface User {
    id: number;
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    avatar: string;
    create_at: Date;
    birth: string;
    isadmin?: number;
    status?: number;
}
export interface User_update {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    avatar?: string | null;
    birth?: string | null;
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
    message: string | null | User[];
}
export interface Login_return {
    status: number;
    message: string;
    access_token: string;
    refresh_token: string;
    secret_key: string;
}
