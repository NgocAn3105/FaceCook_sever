import db from './database';
import { User, HistoryMessage, Response_return } from '../user.model';
import e from 'express';

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
        const user_result = await db.query("select isadmin from get_users() where id=$1", [id]);
        if (user_result.rows.length === 0) return null;
        return {
            status: 200,
            role: user_result.rows[0]
        };
    }

    static async register_user(email: string, password: string): Promise<Response_return> {
        try {
            const check_user = await db.query('select id from get_users() where email=$1', [email]);

            if (check_user.rows.length === 0) return { status: 400, message: 'This email is already register account !' };

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

    static async login_user(email: string): Promise<login_user | null> {
        const user = await db.query("select id, email, password, role from get_users() where email = $1", [email]);
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
        const user = await db.query("select id, email, password,isadmin from get_users() where id = $1", [user_id]);
        if (user.rows.length === 0) return null;
        return user.rows[0];
    }




}