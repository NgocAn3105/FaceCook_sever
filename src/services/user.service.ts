import { HistoryMessage, Login_return, Response_return, User } from '../models/user.model';
import db from '../models/database/database';
import { comparePassword, hashPassword } from '../utils/crypto';
import { generateToken, verifyToken } from '../utils/jwt';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { Userdatabase } from '../models/database/user.db';
import { Helpers } from '../utils/helpers';

export class UserService extends Helpers {

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

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return {
                status: 400,
                message: 'Invalid password'
            }
        }

        const token = generateToken(user, '1d');
        const refreshToken = generateToken(user, '7d');
        const secret_key = await hashPassword(process.env.JWT_SECRET_PUBLIC || 'default_secret_key' + user.id);

        const saved = await Userdatabase.save_refresh_token(user.id, refreshToken, secret_key);
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


    public static async message_history_sender(sender_id: number, receiver_id: number): Promise<{ status: number, message: HistoryMessage[] | null | string }> {
        try {
            const message_result = await Userdatabase.message_history(sender_id, receiver_id);
            return { status: 200, message: message_result };
        } catch (error) {
            return {
                status: 500,
                message: 'Error connect service ' + error
            }
        }

    }

    public static async send_message(data: HistoryMessage): Promise<{ status: number, message: HistoryMessage | null | string }> {
        try {
            const message_result = await Userdatabase.send_messager(data);
            if (!message_result) return { status: 404, message: null };
            return { status: 200, message: message_result };
        } catch (error) {
            return {
                status: 500,
                message: 'Error connect service ' + error
            }
        }
    }

    public static async refresh_token(refresh_token: string): Promise<Login_return | Response_return> {
        try {
            // Verify the refresh token exists in database
            const token_data = await Userdatabase.verify_refresh_token(refresh_token);
            if (!token_data) {
                return {
                    status: 401,
                    message: 'Invalid refresh token'
                };
            }

            // Verify the token signature and expiration
            try {
                verifyToken(refresh_token);
            } catch (error) {
                return {
                    status: 401,
                    message: 'Refresh token expired'
                };
            }

            // Get user data
            const user = await Userdatabase.get_user_by_id(token_data.user_id);
            if (!user) {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }

            // Generate new tokens
            const new_access_token = generateToken(user, '1d');
            const new_refresh_token = generateToken(user, '7d');
            const new_secret_key = await hashPassword(process.env.JWT_SECRET_PUBLIC || 'default_secret_key' + user.id);

            // Save new refresh token
            const saved = await Userdatabase.save_refresh_token(user.id, new_refresh_token, new_secret_key);
            if (!saved) {
                return {
                    status: 500,
                    message: 'Error saving refresh token'
                };
            }

            return {
                status: 200,
                message: 'Token refreshed successfully',
                access_token: new_access_token,
                refresh_token: new_refresh_token,
                secret_key: new_secret_key
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Error refreshing token: ' + error
            };
        }
    }



} 