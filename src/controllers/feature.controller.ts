import { Request, Response } from 'express';
import { feature_service } from '../services/feature.service';
export class feature_controller {
    async insert_post(req: Request, res: Response) {
        const { user_id, content } = req.body;
        const post = await feature_service.insert_post(user_id, content);
        res.status(post.status).json(post);
    }

    async get_list_post(req: Request, res: Response) {
        const posts = await feature_service.get_list_post();
        res.status(posts.status).json(posts);
    }

    async delete_post(req: Request, res: Response) {
        const { post_id } = req.params;
        const post_id_parse = Number(post_id);
        const posts = await feature_service.delete_post(post_id_parse);
        res.status(posts.status).json(posts);
    }
}