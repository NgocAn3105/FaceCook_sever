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



} 