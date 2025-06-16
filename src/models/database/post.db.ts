import db from './database';
import { Response_return } from '../user.model';

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
}