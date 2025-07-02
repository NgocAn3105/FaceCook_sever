import { HistoryMessage, Login_return, Response_return, User, User_update } from '../models/user.model';
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

        // So sánh password
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return { status: 400, message: 'Invalid password' };
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
            message: 'Login successfully',
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







} 