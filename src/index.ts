import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as apiRouter } from './routes';
import path from 'path';
dotenv.config({ path: './config.env' });


const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));

// Routes
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 
