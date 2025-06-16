import { Request, Response } from 'express';
import { feature_service } from '../services/feature.service';
export class feature_controller {
    async insert_post(req: Request, res: Response) {
        const { user_id, content } = req.body;
        const post = await feature_service.insert_post(user_id, content);
        res.status(post.status).json(post);
    }
}