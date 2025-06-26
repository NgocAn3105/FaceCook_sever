import { HistoryMessage, Login_return, Response_return, User } from '../models/user.model';
import db from '../models/database/database';
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
        const valid_email = UserService.validateEmail(email);
        if (!valid_email) {
            return {
                status: 400,
                message: 'Invalid email format'
            }
        }

        const user = await Userdatabase.login_user(email);

        if (!user) {
            return {
                status: 400,
                message: 'Invalid email'
            }
        }
        if (!user.password || typeof user.password !== 'string') {
            return {
                status: 400,
                message: `User Pasword wrong ! : ${user.password}`
            }
        }
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return {
                status: 400,
                message: 'Invalid password'
            }
        }

        const token = generateToken(user, '1d');
        const refreshToken = generateToken(user, '7d');

        if (typeof user?.message == 'string') {
            return { status: 400, message: "User is undefined" }
        }
        const secret_key = await hashPassword(process.env.JWT_SECRET_PUBLIC || 'default_secret_key' + user.message.id);

        const saved = await Userdatabase.save_refresh_token(user.message.id, refreshToken, secret_key);

        if (!saved) {
            return {
                status: 500,
                message: 'Error saving refresh token'
            }
        }

        return {
            status: 200,
            message: 'Login successfully',
            access_token: token,
            refresh_token: refreshToken,
            secret_key: secret_key
        }
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







} 