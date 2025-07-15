import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load biến môi trường từ config.env
dotenv.config({ path: './config.env' });
let pool: Pool;
try {
    pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        ssl: {
            rejectUnauthorized: false
        }
    });
} catch (e) {
    console.log(e);
}



export { pool }

