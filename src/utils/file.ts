import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { generateRandomString } from './crypto';

// Định nghĩa các loại file được phép upload
export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
export const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
export const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        let uploadPath = 'src/uploads/';

        if (allowedImageTypes.includes(file.mimetype)) {
            uploadPath += 'images/';
        } else if (allowedVideoTypes.includes(file.mimetype)) {
            uploadPath += 'videos/';
        } else {
            uploadPath += 'documents/';
        }

        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = generateRandomString(16);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra loại file
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes, ...allowedDocTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

// Cấu hình upload
export const uploadPost = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

export const uploadAvatar = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
// Xóa file
export const deleteFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.unlink(filePath, (err: Error) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Lấy kích thước file
export const getFileSize = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.stat(filePath, (err: Error, stats: { size: number }) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats.size);
            }
        });
    });
}; 