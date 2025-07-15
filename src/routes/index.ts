import express from 'express';
import { router as userRouter } from './user.routes';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../utils/jwt';
const userController = new UserController();

export const router = express.Router();
router.post('/update-password', userController.Update_password);
router.post('/register', userController.Register);
router.post('/users/login', userController.Login);
router.use('/users', authenticateToken, userRouter);



// Health check route
router.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'OK' });
}); 