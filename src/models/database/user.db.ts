import { pool as db } from './database';
import { User, User_update, Response_return, Message } from '../user.model';



type refresh_token_data = {
    user_id: number;
    refresh_token: string;
    key_public: string;
}
type return_user = {
    status?: number;
    message: User | string;
    password?: string;
}

export class Userdatabase {
    static async get_users(id: number): Promise<{ status: number, message: User[] | string }> {
        try {
            const res = await db.query('select * from get_users() where id =$1', [id]);
            return { status: 200, message: res.rows };

        } catch (error) {
            return {
                status: 500,
                message: `error system :${error}`
            }
        }

    }

    static async Find_User_byId(id: number): Promise<Response_return> {
        const user_result = await db.query("select isadmin from get_users() where id=$1", [id]);
        if (user_result.rows.length === 0) return { status: 404, message: null }
        return {
            status: 200,
            message: user_result.rows[0]
        };
    }

    static async register_user(email: string, password: string): Promise<Response_return> {
        try {
            const check_user = await db.query('select id from get_users() where email=$1', [email]);

            if (check_user.rows.length !== 0) return { status: 400, message: 'This email is already register account !' };

            await db.query('call insert_user($1,$2)', [email, password]);

            return {
                status: 200,
                message: "Register Account is Success"
            }
        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }

    static async login_user(email: string): Promise<return_user | null> {
        const user = await db.query("select * from get_users() where email = $1", [email]);
        const password_user = (await db.query('select password from users where email=$1', [email])).rows[0]?.password;
        if (user.rows.length === 0) return null;
        return {
            message: user.rows[0],
            password: password_user
        }


    }

    static async save_refresh_token(user_id: number, refresh_token: string, key_public: string): Promise<Response_return> {
        try {
            const valid_refresh_token = await db.query("select * from refresh_token where user_id=$1", [user_id]);
            if (valid_refresh_token.rows.length > 0) {
                await db.query("update refresh_token set refresh_token=$1 where user_id=$2", [refresh_token, user_id]);
                return { status: 200, message: null }
            }
            const result = await db.query("insert into refresh_token (user_id,refresh_token,key_public) values ($1,$2,$3)",
                [user_id, refresh_token, key_public]);
            return { status: 200, message: null }
        } catch (e) {
            return { status: 500, message: `error ${e}` }
        }
    }

    static async get_user_by_id(user_id: number): Promise<return_user | null> {
        const user = await db.query("select * from get_users() where id = $1", [user_id]);
        if (user.rows.length === 0) return null;
        return user.rows[0];
    }

    static async update_user(formData: User_update): Promise<Response_return> {
        try {
            const { id, first_name, last_name, avatar, birth } = formData;
            await db.query('call update_user($1,$2,$3,$4,$5)', [id, first_name, last_name, avatar, birth]);
            return {
                status: 200,
                message: "Update Success"
            }
        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }

    static async friendship_list(user_id: number): Promise<Response_return> {
        try {
            const res = await db.query(`select * from get_friend_by_userId($1)`, [user_id]);
            if (res.rows.length === 0) return { status: 400, message: null };
            return {
                status: 200,
                message: res.rows
            }

        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }
    static async add_friend(user_id: number, friend_id: number): Promise<Response_return> {
        try {
            const friend = await this.friendship_list(user_id);
            if (friend.message === null) {
                await db.query('CALL add_friend($1, $2)', [user_id, friend_id]);
                return { status: 200, message: "Add friend success" };
            } else if (!Array.isArray(friend.message)) return { status: 404, message: "can not add friend !" };
            const existFriend = friend.message.find((item) => item.id == friend_id);
            if (existFriend) {
                return { status: 400, message: "You have already added this user!" };
            }
            await db.query('CALL add_friend($1, $2)', [user_id, friend_id]);
            return { status: 200, message: "Add friend success" };
        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }

    static async accept_friend(user_id: number, friend_id: number): Promise<Response_return> {
        try {
            await db.query('call accept_friend($1,$2)', [user_id, friend_id]);
            return { status: 200, message: "accepted friend success" };
        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }

    static async unfriend(user_id: number, friend_id: number): Promise<Response_return> {
        try {
            const friend = await this.friendship_list(user_id);
            if (!Array.isArray(friend.message)) return { status: 404, message: "can not unfriend !" };
            const existFriend = friend.message.find((item) => item.id == friend_id);
            if (!existFriend) {
                return { status: 400, message: "You haven't already added this user!" };
            }
            await db.query('call unfriend($1,$2)', [user_id, friend_id]);
            return { status: 200, message: " unfriend success" };
        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }

    static async send_message(formData: Message): Promise<Response_return> {
        const { sender_id, receiver_id, content } = formData;
        try {
            let sendUser = await this.Find_User_byId(sender_id);
            let receiverUser = await this.Find_User_byId(receiver_id);
            if (sendUser.status != 200 && receiverUser.status != 200) {
                if (sendUser.message == null) return sendUser;
                return receiverUser;
            }

            await db.query('call send_message($1,$2,$3)', [sender_id, receiver_id, content]);
            return {
                status: 200,
                message: "send success!"
            }

        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }


    static async get_messages(user_id: number, friend_id: number): Promise<Response_return> {
        try {
            let sendUser = await this.Find_User_byId(user_id);
            let receiverUser = await this.Find_User_byId(friend_id);
            if (sendUser.status != 200 && receiverUser.status != 200) {
                if (sendUser.message == null) return sendUser;
                return receiverUser;
            }

            const res = await db.query('select distinct on (created_at)  * from get_messages($1,$2) order by created_at desc', [user_id, friend_id]);
            return {
                status: 200,
                message: res.rows
            }

        } catch (error) {
            return {
                status: 500,
                message: `error system :${error} `
            }
        }
    }


}