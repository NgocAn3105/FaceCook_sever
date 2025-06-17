import express from 'express';
import { UserController } from '../controllers/user.controller';
import { feature_controller } from '../controllers/feature.controller';

export const router = express.Router();
const userController = new UserController();
const featurecontroller = new feature_controller();
router.post('/login', userController.Login);
router.post('/update-password', userController.Update_password);

//feature
router.post('/message/history', userController.message_history);
router.post('/message/send', userController.send_message);

//post
router.post('/post/add', featurecontroller.insert_post);
router.get('/post', featurecontroller.get_list_post);
router.post('/post/delete', featurecontroller.delete_post);