import db from './database';
import { User, HistoryMessage, Response_return } from '../user.model';

type find_user = {
    status: number,
    role: "admin" | "user";
};
type login_user = {
    id: number;
    email: string;
    password: string;
    role: string;
}

type refresh_token_data = {
    user_id: number;
    refresh_token: string;
    key_public: string;
}

export class Userdatabase {
    static async Find_User_byId(id: number): Promise<find_user | null> {
        const user_result = await db.query("select role  from users where id=$1", [id]);
        if (user_result.rows.length === 0) return null;
        return {
            status: 200,
            role: user_result.rows[0]
        };
    }

    static async login_user(email: string): Promise<login_user | null> {
        const user = await db.query("select id, email, password, role from users where email = $1", [email]);
        if (user.rows.length === 0) return null;
        return user.rows[0];
    }

    static async save_refresh_token(user_id: number, refresh_token: string, key_public: string): Promise<boolean> {
        const valid_refresh_token = await db.query("select * from refresh_token where refresh_token=$1", [refresh_token]);
        if (valid_refresh_token.rows.length > 0) {
            await db.query("delete from refresh_token where refresh_token=$1", [refresh_token]);
        }
        const result = await db.query("insert into refresh_token (user_id,refresh_token,key_public) values ($1,$2,$3)",
            [user_id, refresh_token, key_public]);
        return result.rowCount ? result.rowCount > 0 : false;
    }

    static async message_history(sender_id: number, receiver_id: number): Promise<HistoryMessage[] | null> {
        const result = await db.query(`select sender_id,receiver_id,content,created_at,status from messages 
                                        where  (sender_id=$1 and receiver_id=$2 ) or (sender_id=$2 and receiver_id=$1 )
                                        order by created_at asc`, [sender_id, receiver_id]);
        if (result.rows.length === 0) return null;
        return result.rows;
    }

    static async send_messager(data: HistoryMessage): Promise<HistoryMessage | null> {
        const { sender_id, receiver_id, content, created_at, status } = data;
        const result = await db.query("insert into messages (sender_id , receiver_id,content,created_at,status) values ($1,$2,$3,$4,$5) RETURNING *"
            , [sender_id, receiver_id, content, created_at, status]);
        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    static async verify_refresh_token(refresh_token: string): Promise<refresh_token_data | null> {
        const result = await db.query(`
            SELECT rt.user_id, rt.refresh_token, rt.key_public 
            FROM refresh_token rt 
            WHERE rt.refresh_token = $1
        `, [refresh_token]);

        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    static async get_user_by_id(user_id: number): Promise<login_user | null> {
        const user = await db.query("select id, email, password, role from users where id = $1", [user_id]);
        if (user.rows.length === 0) return null;
        return user.rows[0];
    }
}