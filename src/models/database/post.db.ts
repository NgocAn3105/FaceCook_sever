import db from './database';
import { Response_return } from '../user.model';
import { Response_post } from '../post.model';
export class feature_post {
    public static async insert_post(user_id: number, content: string): Promise<Response_return> {
        try {
            let result = await db.query("CALL insert_post($1, $2)", [user_id, content]);

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



}