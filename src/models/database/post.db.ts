import db from './database';
import { Response_return } from '../user.model';
import { Response_post, comment } from '../post.model';
export class feature_post {
    public static async insert_post(user_id: number, content: string): Promise<Response_return> {
        try {
            await db.query("CALL insert_post($1, $2)", [user_id, content]);

            return {
                status: 200,
                message: "Thêm bài viết thành công",
            }
        } catch (error) {
            return {
                status: 500,
                message: "Thêm bài viết thất bại",
            }
        }
    }

    public static async get_list_data(): Promise<Response_post> {
        try {
            let result = await db.query("select * from get_list_post()");
            if (result.rows.length === 0) return { status: 404, message: null }

            return {
                status: 200,
                message: result.rows
            }
        } catch (error) {
            return {
                status: 500,
                message: "Can't get data"
            }
        }
    }
    public static async delete_post(post_id: number): Promise<Response_post> {
        try {
            await db.query("call delete_post($1);", [post_id]);
            return {
                status: 200,
                message: "Delete Post Success"
            };
        } catch (error) {
            return {
                status: 500,
                message: "Error can't delete post"
            };
        }
    }

    // cmt
    public static async insert_comment_post(formData: comment): Promise<Response_post> {
        try {
            const { post_id, user_id, content } = formData;
            await db.query("call insert_cmt_post($1,$2,$3)", [post_id, user_id, content]);
            return {
                status: 200,
                message: "Add Comment Success"
            }

        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }

    }

    public static async insert_ReplyComment_post(formData: comment): Promise<Response_post> {
        try {
            const { post_id, user_id, content, parent_id } = formData;
            const res = await db.query("call insert_reply_cmt_post($1,$2,$3,$4)", [post_id, user_id, content, parent_id]);
            return {
                status: 200,
                message: "Add Comment Success"
            }

        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }


    static async get_cmt_father(): Promise<Response_post> {
        try {
            const res = await db.query('select * from get_list_cmt_father()');
            if (res.rows.length === 0) return { status: 400, message: "Bad Request" };
            return {
                status: 200,
                message: res.rows
            }
        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }
    static async get_cmt_reply(): Promise<Response_post> {
        try {
            const res = await db.query('select * from get_list_cmt_Reply()');
            if (res.rows.length === 0) return { status: 400, message: "Bad Request" };
            return {
                status: 200,
                message: res.rows
            }
        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }

}