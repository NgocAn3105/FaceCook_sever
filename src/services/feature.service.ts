import { Userdatabase } from "../models/database/user.db";
import { Response_return } from '../models/user.model';
import { Response_post, comment } from '../models/post.model';

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
    public static async delete_post(post_id: number): Promise<Response_post> {
        if (!post_id) return { status: 400, message: "Missing Required" };
        let post = await feature_post.delete_post(post_id);
        return post;
    }

    public static async insert_cmt_post(formData: comment): Promise<Response_post> {
        const { post_id, user_id, content } = formData;
        if (!post_id || !user_id || !content) return { status: 404, message: "Missing required !" };
        const check_user = await Userdatabase.Find_User_byId(user_id);
        if (check_user?.status == 200) {
            const cmt = await feature_post.insert_comment_post(formData);
            return cmt;
        }
        return {
            status: 400,
            message: "Not Found User"
        }

    }

    public static async insert_Replycmt_post(formData: comment): Promise<Response_post> {
        const { post_id, user_id, content, parent_id } = formData;
        if (!post_id || !user_id || !content || !parent_id) return { status: 404, message: "Missing required !" };
        const check_user = await Userdatabase.Find_User_byId(user_id);
        if (check_user?.status == 200) {
            const cmt = await feature_post.insert_ReplyComment_post(formData);
            return cmt;
        }
        return {
            status: 400,
            message: "Not Found User"
        }

    }

    public static async get_cmt_father(): Promise<Response_post> {
        const get_cmt = await feature_post.get_cmt_father();
        return get_cmt;
    }
    public static async get_cmt_reply(): Promise<Response_post> {
        const get_cmt = await feature_post.get_cmt_reply();
        return get_cmt;
    }
}