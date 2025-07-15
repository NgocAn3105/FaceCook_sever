import { Request, response, Response } from 'express';
import { UserService } from '../services/user.service';
import { Userdatabase } from '../models/database/user.db';
import { AuthenticatedRequest } from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';



export class UserController {
    public async Register(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.register_user(email, password);
        return res.status(user.status).json(user);
    }

    public async Login(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.Login_users(email, password as string);
        return res.status(user.status).json(user);
    }
    public async Update_password(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.update_password(email, password);
        if (user.status === 400) {
            return res.status(400).json(user);
        }
        return res.status(200).json(user);
    }
    public async get_users(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const id = message.id
        const users = await Userdatabase.get_users(id);
        return res.status(users.status).json(users);
    }

    public async update_user(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const id = message.id
        const { first_name, last_name, avatar, birth } = req.body;
        const formData = { id, first_name, last_name, avatar, birth }
        const user = await UserService.update_user(formData);
        return res.status(user.status).json(user);
    }

    public async get_friends(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const user_id = message.id;
        const friends = await UserService.get_friends(Number(user_id));
        return res.status(friends.status).json(friends);
    }
    public async add_friend(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const user_id = message.id;
        const { friend_id } = req.body;
        const friend = await UserService.add_friend(user_id, friend_id);
        return res.status(friend.status).json(friend);
    }

    public async accept_friend(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const user_id = message.id;
        const { friend_id } = req.body;
        const friend = await UserService.accept_friend(user_id, friend_id);
        return res.status(friend.status).json(friend);
    }

    public async unfriend(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const user_id = message.id;
        const { friend_id } = req.body;
        const friend = await UserService.unfriend(user_id, friend_id);
        return res.status(friend.status).json(friend);
    }

    public async sendMessage(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const sender_id = message.id;
        const { receiver_id, content } = req.body;
        const formdata = { sender_id, receiver_id, content };
        const messageUser = await UserService.sendMesages(formdata);
        return res.status(messageUser.status).json(messageUser);

    }
    public async getMessage(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { message } = req.user as JwtPayload;
        const user_id = message.id;
        const { friend_id } = req.body;
        const messageUser = await UserService.getMessage(user_id, friend_id);
        return res.status(messageUser.status).json(messageUser);
    }
} 