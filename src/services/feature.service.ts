import { Userdatabase } from "../models/database/user.db";

import { Response_return } from '../models/user.model';
import { Like, Response_post, comment } from '../models/post.model';

import { feature_post } from '../models/database/post.db'
import { Like_enum } from "../constants/enum";
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

    public static async add_like_post(formData: Like): Promise<Response_post> {
        const { post_id, user_id, typed } = formData;
        if (!post_id || !user_id || !typed) return { status: 400, message: "Missing Required !" };
        if (!Object.values(Like_enum).includes(typed as Like_enum)) return { status: 404, message: `${typed} not have in enum like !` };

        const user = await Userdatabase.get_user_by_id(user_id);
        if (user != null) {
            const like = await feature_post.add_like_post(formData);
            return like;
        }
        return {
            status: 400,
            message: `Not Found User : ${user_id} !`
        }
    }

    public static async add_like_cmt(formData: Like): Promise<Response_post> {
        const { comment_id, user_id, typed } = formData;
        if (!comment_id || !user_id || !typed) return { status: 400, message: "Missing Required !" };
        if (!Object.values(Like_enum).includes(typed as Like_enum)) return { status: 404, message: `${typed} not have in enum like !` };

        const user = await Userdatabase.get_user_by_id(user_id);

        if (user != null) {

            const like = await feature_post.add_like_cmt(formData);
            return like;
        }
        return {
            status: 400,
            message: `Not Found User : ${user_id} !`
        }
    }


    public static async get_cmt_like(comment_id: number): Promise<Response_post> {
        if (!comment_id) return { status: 400, message: "Missing Required !" };
        const like = await feature_post.get_cmt_like(comment_id);
        return like;
    }

    public static async get_post_like(post_id: number): Promise<Response_post> {
        if (!post_id) return { status: 400, message: "Missing Required !" };
        const like = await feature_post.get_post_like(post_id);
        return like;
    }
    public static async update_like(formData: Like): Promise<Response_post> {
        const { comment_id, post_id, user_id, typed } = formData;
        if (!user_id) return { status: 400, message: "Missing Required user_id and typed !" };
        if (!post_id) {
            if (!comment_id) return { status: 400, message: "Missing Required !" }
            const formData = { comment_id, user_id, typed };
            const res = await feature_post.update_cmt_like(formData);
            return res;
        }
        const formDataofPost = { post_id, user_id, typed };
        const res = await feature_post.update_post_like(formDataofPost);
        return res;
    }
}