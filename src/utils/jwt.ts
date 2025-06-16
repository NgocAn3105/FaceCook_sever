import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const generateToken = (payload: object, expiresIn: string): string => {
    const options = { expiresIn } as SignOptions;
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
}; 