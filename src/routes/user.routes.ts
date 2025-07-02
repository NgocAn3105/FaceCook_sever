import express from 'express';
import { UserController } from '../controllers/user.controller';
import { feature_controller } from '../controllers/feature.controller';

export const router = express.Router();
const userController = new UserController();
const featurecontroller = new feature_controller();
//user

router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/update-password', userController.Update_password);
router.post('/update', userController.update_user);
router.get('/', userController.get_users);

//feature

//post
router.post('/post/add', featurecontroller.insert_post);
router.get('/post', featurecontroller.get_list_post);
router.post('/post/delete', featurecontroller.delete_post);

//comment

router.get('/post/comment', featurecontroller.get_cmt_father);
router.post('/post/comment', featurecontroller.insert_cmt);
router.post('/post/comment/reply', featurecontroller.insert_Replycmt);
router.get('/post/comment/reply', featurecontroller.get_cmt_reply);

//like
router.post('/post/like', featurecontroller.add_like_post);
router.post('/post/comment/like', featurecontroller.add_like_cmt);
router.get('/post/like/:post_id', featurecontroller.get_post_like);
router.get('/post/comment/like/:comment_id', featurecontroller.get_cmt_like);
//update like
router.post('/post/like-update', featurecontroller.update_like);
router.post('/post/comment/like-update', featurecontroller.update_like);


