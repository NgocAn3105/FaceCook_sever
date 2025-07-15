import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../models/user.model';

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


export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader && authHeader.split(' ')[1]; // dạng 'Bearer token'

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }

        req.user = decoded;
        next();
    });
}
