import { Message, Login_return, Response_return, User, User_update } from '../models/user.model';
import { pool as db } from '../models/database/database';
import { comparePassword, hashPassword, valid_email } from '../utils/crypto';
import { generateToken, verifyToken } from '../utils/jwt';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { Userdatabase } from '../models/database/user.db';
import { Helpers } from '../utils/helpers';
import e from 'express';


export class UserService extends Helpers {

    public static async register_user(email: string, password: string): Promise<Response_return> {

        if (!email || !password) return { status: 400, message: "Missing Required" };
        const regexEmail = valid_email(email);
        if (regexEmail == false) return { status: 400, message: `Params Wrong format Email ! ${regexEmail}` };

        try {
            const PasswordHash = await hashPassword(password);
            const user = await Userdatabase.register_user(email, PasswordHash);
            return user;
        } catch (error) {
            return {
                status: 500,
                message: `Services Error : ${error}`
            }
        }
    }

    public static async Login_users(email: string, password: string): Promise<Login_return | Response_return> {
        // Validate email
        if (!UserService.validateEmail(email)) {
            return { status: 400, message: 'Invalid email format' };
        }

        // Lấy user theo email
        const user = await Userdatabase.login_user(email);
        if (!user || typeof user.message === 'string') {
            return { status: 400, message: 'Invalid email' };
        }

        // Kiểm tra password hash có hợp lệ không
        if (typeof user.password !== 'string') {
            return { status: 400, message: 'User password invalid' };
        }

        if (!password || !email) return { status: 404, message: "Missing required!" }
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return { status: 200, message: null };
        }

        // Tạo token và refresh token
        const token = generateToken(user, '1d');
        const refreshToken = generateToken(user, '7d');

        // Tạo secret key và lưu refresh token
        const secret_key = await hashPassword((process.env.JWT_SECRET_PUBLIC || 'default_secret_key') + user.message.id);
        const saved = await Userdatabase.save_refresh_token(user.message.id, refreshToken, secret_key);

        if (!saved) {
            return { status: 500, message: 'Error saving refresh token' };
        }

        // Trả về response thành công
        return {
            status: 200,
            message: "login success",
            access_token: token,
            refresh_token: refreshToken,
            secret_key: secret_key
        };
    }


    public static async update_password(email: string, password: string): Promise<Response_return> {
        const hashedPassword = await hashPassword(password);
        console.log(hashPassword);
        const query = await db.query("update users set password=$1 where email=$2", [hashedPassword, email]);
        if (query.rowCount === 0) {
            return {
                status: 400,
                message: 'Update password failed'
            }
        }
        return {
            status: 200,
            message: 'Update password successfully'
        }
    }

    public static async update_user(formData: User_update): Promise<Response_return> {
        let { id, first_name, last_name, avatar, birth } = formData;

        if (!id) return { status: 400, message: 'Missing required id!' };

        // Clean param: '' → null
        first_name = (first_name === '' ? null : first_name);
        last_name = (last_name === '' ? null : last_name);
        avatar = (avatar === '' ? null : avatar);
        birth = (birth === '' ? null : birth);

        const new_formData: User_update = {
            id, first_name, last_name, avatar, birth
        };

        const user = await Userdatabase.update_user(new_formData);
        return user;
    }


    public static async get_friends(user_id: number): Promise<Response_return> {
        if (!user_id) return { status: 400, message: "Missing Required !" };
        const user = await Userdatabase.Find_User_byId(user_id);
        if (user?.status == 200) {
            const friends = await Userdatabase.friendship_list(user_id);
            return friends;
        }
        return {
            status: 404,
            message: `Not Found User ${user_id} ! `
        }
    }
    private static async friend(user_id: number, friend_id: number): Promise<Response_return> {
        if (!user_id || !friend_id) return { status: 400, message: "Missing Required !" };
        const user = await Userdatabase.Find_User_byId(user_id);
        const friend = await Userdatabase.Find_User_byId(friend_id);
        if (user?.status != 200 && friend?.status != 200) return { status: 400, message: "Not found user or friend user !" };
        return { status: 200, message: null };
    }
    public static async add_friend(user_id: number, friend_id: number): Promise<Response_return> {
        const check = await this.friend(user_id, friend_id);
        if (check.status == 200) {
            const addfriend = await Userdatabase.add_friend(user_id, friend_id);
            return addfriend;
        }
        return check;
    }

    public static async accept_friend(user_id: number, friend_id: number): Promise<Response_return> {
        const check = await this.friend(user_id, friend_id);
        if (check.status == 200) {
            const acceptfriend = await Userdatabase.accept_friend(user_id, friend_id);
            return acceptfriend;
        }
        return check;
    }
    public static async unfriend(user_id: number, friend_id: number): Promise<Response_return> {
        const check = await this.friend(user_id, friend_id);
        if (check.status == 200) {
            const friend = await Userdatabase.unfriend(user_id, friend_id);
            return friend;
        }
        return check;
    }

    public static async sendMesages(formData: Message): Promise<Response_return> {
        const { sender_id, receiver_id, content } = formData;
        if (!sender_id || !receiver_id || !content) return { status: 400, message: "Missing Required !" };
        const UserMesage = await Userdatabase.send_message(formData);
        return UserMesage;
    }

    public static async getMessage(user_id: number, friend_id: number): Promise<Response_return> {
        if (!user_id || !friend_id) return { status: 400, message: "Missing Required !" };
        const UserMesage = await Userdatabase.get_messages(user_id, friend_id);
        return UserMesage;
    }
} 