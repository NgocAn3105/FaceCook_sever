import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const valid_email = (email: string): boolean => {
    const EmailRegex = /^[A-Za-z0-9_-]+@[A-Za-z-0-9.-]+\.[A-Za-z]{2,}$/;
    return EmailRegex.test(email);
}


export const generateRandomString = (length: number): string => {
    return crypto.randomBytes(length).toString('hex');
};

export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}; 