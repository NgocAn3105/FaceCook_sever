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
        const { post_id } = req.body;
        const post_id_parse = Number(post_id);
        const posts = await feature_service.delete_post(post_id_parse);
        res.status(posts.status).json(posts);
    }
    ///cmt
    async insert_cmt(req: Request, res: Response) {
        const { post_id, user_id, content } = req.body;
        const formData = { post_id, user_id, content };
        const cmt_insert = await feature_service.insert_cmt_post(formData);
        res.status(cmt_insert.status).json(cmt_insert);
    }


    async insert_Replycmt(req: Request, res: Response) {
        const { post_id, user_id, content, parent_id } = req.body;
        const formData = { post_id, user_id, content, parent_id };
        const cmt_insert = await feature_service.insert_Replycmt_post(formData);
        res.status(cmt_insert.status).json(cmt_insert);
    }

    async get_cmt_father(req: Request, res: Response) {
        const cmt = await feature_service.get_cmt_father();
        res.status(cmt.status).json(cmt);
    }
    async get_cmt_reply(req: Request, res: Response) {
        const cmt = await feature_service.get_cmt_reply();
        res.status(cmt.status).json(cmt);
    }
    ///like
    async add_like_post(req: Request, res: Response) {
        const { post_id, user_id, typed } = req.body;
        const formData = { post_id, user_id, typed };
        const like = await feature_service.add_like_post(formData);
        res.status(like.status).json(like);

    }

    async add_like_cmt(req: Request, res: Response) {
        const { comment_id, user_id, typed } = req.body;
        const formData = { comment_id, user_id, typed };
        const like = await feature_service.add_like_post(formData);
        res.status(like.status).json(like);

    }
    async get_cmt_like(req: Request, res: Response) {
        const { comment_id } = req.params;
        const like = await feature_service.get_cmt_like(Number(comment_id));
        res.status(like.status).json(like);
    }
    async get_post_like(req: Request, res: Response) {
        const { post_id } = req.params;
        const like = await feature_service.get_post_like(Number(post_id));
        res.status(like.status).json(like);
    }

    async update_like(req: Request, res: Response) {
        const { post_id, comment_id, user_id, typed } = req.body;
        const formData = {
            post_id, comment_id, user_id, typed
        }
        const like = await feature_service.update_like(formData);
        res.status(like.status).json(like);

    }
}