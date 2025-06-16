import express from 'express';
import { UserController } from '../controllers/user.controller';

export const router = express.Router();
const userController = new UserController();

router.post('/login', userController.Login);
router.post('/update-password', userController.Update_password);

//feature
router.post('/message/history', userController.message_history);
router.post('/message/send', userController.send_message);