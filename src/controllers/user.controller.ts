import { Request, response, Response } from 'express';
import { UserService } from '../services/user.service';
import { Userdatabase } from '../models/database/user.db';
export class UserController {
    public async Register(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.register_user(email, password);
        return res.status(user.status).json(user);
    }

    public async Login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.Login_users(email, password as string);
        if (user.status === 400) {
            return res.status(400).json(user);
        }
        return res.status(200).json(user);
    }
    public async Update_password(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.update_password(email, password);
        if (user.status === 400) {
            return res.status(400).json(user);
        }
        return res.status(200).json(user);
    }
    public async get_users(req: Request, res: Response): Promise<Response> {
        const users = await Userdatabase.get_users();
        return res.status(users.status).json(users);
    }

    public async update_user(req: Request, res: Response): Promise<Response> {
        const { id, first_name, last_name, avatar, birth } = req.body;
        const formData = { id, first_name, last_name, avatar, birth }
        const user = await UserService.update_user(formData);
        return res.status(user.status).json(user);
    }

    public async get_friends(req: Request, res: Response): Promise<Response> {
        const { user_id } = req.params;
        const friends = await UserService.get_friends(Number(user_id));
        return res.status(friends.status).json(friends);
    }
    public async add_friend(req: Request, res: Response): Promise<Response> {
        const { user_id, friend_id } = req.body;

        const friend = await UserService.add_friend(user_id, friend_id);
        return res.status(friend.status).json(friend);
    }

    public async accept_friend(req: Request, res: Response): Promise<Response> {
        const { user_id, friend_id } = req.body;
        const friend = await UserService.accept_friend(user_id, friend_id);
        return res.status(friend.status).json(friend);
    }
} 