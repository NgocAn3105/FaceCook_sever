import { pool as db, client } from './database';
import { Response_return } from '../user.model';
import { Call_list_like, Like, Response_post, comment } from '../post.model';
import { start } from 'repl';
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
            let result = await db.query("select * from get_list_post() where status != 0");
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

    //like bai viet va like comment

    static async add_like_post(formData: Like): Promise<Response_post> {
        const { post_id, user_id, typed } = formData;
        try {
            const res = await this.get_cmt_post_like(post_id);
            let userID
            if (Array.isArray(res)) {
                if (res.length > 0) {
                    userID = res.filter((item) => {
                        return item.user_id == user_id;
                    });


                }
            }
            if (!userID || userID.length === 0) {
                await db.query('call add_post_like($1,$2,$3)', [post_id, user_id, typed]);
                return {
                    status: 200,
                    message: "Add like Success"
                }
            }
            return { status: 404, message: "User as already like this post!" };


        } catch (error) {
            return {
                status: 500,
                message: `${error}`
            }
        }
    }

    static async add_like_cmt(formData: Like): Promise<Response_post> {
        const { comment_id, user_id, typed } = formData;
        try {
            const res = await this.get_cmt_post_like(comment_id);
            let userID
            if (Array.isArray(res)) {
                if (res.length > 0) {
                    userID = res.filter((item) => {
                        return item.user_id == user_id;
                    });
                }
            }
            if (!userID || userID.length === 0) {
                await db.query('call add_comment_like($1,$2,$3)', [comment_id, user_id, typed]);
                return {
                    status: 200,
                    message: "Add like Success"
                }
            }
            return { status: 404, message: "User as already like this comment!" };
        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }

    static async get_cmt_like(comment_id: number): Promise<Call_list_like> {
        try {
            const res = await this.get_cmt_post_like(comment_id);

            if (res == null) return { status: 400, message: `Not Found Like this comment  ${comment_id} !` };
            if (Array.isArray(res)) {
                if (res.length === 0) return { status: 404, message: `Not Found Like this comment  ${comment_id} ! please add more like` }
                const count = res.length;
            }
            return {
                status: 200,
                count: 1,
                message: res
            }

        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }

    static async get_post_like(post_id: number): Promise<Call_list_like> {
        try {
            const res = await this.get_cmt_post_like(post_id);
            let count;
            if (res == null) return { status: 400, message: `Not Found Like this post  ${post_id}!` };
            if (Array.isArray(res)) {
                if (res.length === 0) return { status: 404, message: `Not Found Like this post  ${post_id} ! please add more like` };
                count = res.length;
            }
            return {
                status: 200,
                count: count,
                message: res
            }

        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }

    private static async get_cmt_post_like(post_id?: number, comment_id?: number): Promise<Like[] | Like | null> {
        try {
            let res: Like | Like[];
            if (!post_id) {
                const cmt = await db.query('select * from get_cmt_like() where comment_id = $1 and typed is not null', [comment_id]);
                res = cmt.rows;
            } else {
                const post = await db.query('select * from get_post_like() where post_id = $1 and typed is not null', [post_id]);
                res = post.rows;
            }
            return res;

        } catch (error) {
            return null;
        }
    }

    static async update_post_like(formData: Like): Promise<Response_post> {
        const { post_id, user_id, typed } = formData;
        try {
            const res = await this.get_cmt_post_like(post_id);
            if (Array.isArray(res)) {
                const user = res.filter((item) => item.user_id = user_id);

                if (user.length === 0) return { status: 400, message: "User have not liked this post yet !" };
                await db.query(`update post_likes set typed=$1 where post_id=$2 and user_id =$3;`, [typed, post_id, user_id]);
                return { status: 200, message: `Update like of user ${user_id} Succesful !` };
            }
            return { status: 404, message: `Can not get this post ${post_id}` };
        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }
    static async update_cmt_like(formData: Like): Promise<Response_post> {
        const { comment_id, user_id, typed } = formData;
        try {
            const res = await this.get_cmt_post_like(comment_id);
            if (Array.isArray(res)) {
                const user = res.filter((item) => item.user_id = user_id);
                if (user.length === 0) return { status: 400, message: "User have not liked this comment yet !" };
                await db.query(`update comment_likes set typed=$1 where comment_id=$2 and user_id =$3;`, [typed, comment_id, user_id]);
                return { status: 200, message: `Update like of user ${user_id} Succesful !` };
            }
            return { status: 404, message: `Can not get this comment ${comment_id}` };
        } catch (error) {
            return {
                status: 500,
                message: `Error : ${error}`
            }
        }
    }

}