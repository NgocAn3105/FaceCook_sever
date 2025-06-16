import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const sendVerificationEmail = async (
    to: string,
    verificationCode: string
): Promise<boolean> => {
    const subject = 'Email Verification';
    const html = `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
    `;
    return sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string
): Promise<boolean> => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset';
    const html = `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    `;
    return sendEmail(to, subject, html);
}; 