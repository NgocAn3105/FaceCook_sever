export interface Post {
    user_id: number;
    content: string;
    created_at: Date;
    status: number;
}

export interface comment {
    post_id: number;
    user_id: number;
    content: string;
    parent_id?: number;
}

export interface Response_post {
    status: number;
    message: Post | Post[] | null | string
}
