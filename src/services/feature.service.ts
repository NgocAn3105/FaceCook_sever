import { Userdatabase } from "../models/database/user.db";
import { Response_return } from '../models/user.model';
import { feature_post } from '../models/database/post.db'
export class feature_service {

    public static async insert_post(user_id: number, content: string): Promise<Response_return> {
        if (!user_id || !content) {
            return {
                message: "User id or content is required",
                status: 400
            }
        }
        const check_user = await Userdatabase.Find_User_byId(user_id);
        if (!check_user) {
            return {
                message: "User not found",
                status: 404
            }
        }
        let post = await feature_post.insert_post(user_id, content);
        return post;
    }

    public static async get_list_post() {
        let posts = await feature_post.get_list_data();
        return posts;
    }
}