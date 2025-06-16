import express from 'express';
import { router as userRouter } from './user.routes';

export const router = express.Router();

router.use('/users', userRouter);

// Health check route
router.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'OK' });
}); 