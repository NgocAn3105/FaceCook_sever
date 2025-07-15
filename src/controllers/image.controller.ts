import { Request, Response } from 'express';
import path from 'path';

// Upload ảnh
export const uploadImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    return {
        status: 200,
        message: 'Upload successful',
        url: `${req.file.filename}`

    }
};

// Trả ảnh
export const getImage = (req: Request, res: Response) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/images', filename);
    console.log(imagePath);
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'Image not found' });
        }
    });
}; 