export interface Post {
    user_id: number;
    content: string;
    image?: string;
    created_at: Date;
    status: number;
}

export interface comment {
    post_id: number;
    user_id: number;
    content: string;
    parent_id?: number;
}

export interface Like {
    comment_id?: number;
    post_id?: number;
    user_id: number;
    typed: string;
    status?: number;
}

export interface Response_post {
    status: number;
    message: Post | Post[] | comment | comment[] | Like | Like[] | null | string
}

export interface Call_list_like extends Response_post {
    count?: number;
}