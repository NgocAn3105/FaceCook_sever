import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

// Load biến môi trường từ config.env
dotenv.config({ path: './config.env' });

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    ssl: {
        rejectUnauthorized: false
    }
});
const client = new Client({
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`,
    ssl: {
        rejectUnauthorized: false
    }
});

export { pool, client }
