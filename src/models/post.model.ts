export interface Post {
    user_id: number;
    content: string;
    created_at: Date;
    status: number;
}

export interface Response_post {
    status: number;
    message: Post | Post[] | null | string
}