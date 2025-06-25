import { Request, response, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {

    public async Login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await UserService.Login_users(email, password);
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



} 