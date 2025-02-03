import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Define allowed file types
const FILE_TYPE: Record<string, string> = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'image/heif': 'heif',
    'image/heic': 'heic',
    'image/avif': 'avif'
};

// Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const isValidFile = FILE_TYPE[file.mimetype];
        if (isValidFile) {
            cb(null, 'uploads');
        } else {
            cb(new Error('File type not supported'), 'uploads');
        }
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const fileName = file.originalname.replace(/\s+/g, '-');
        const extension = FILE_TYPE[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

// Multer upload instance
const uploadImage = multer({ storage });

export default uploadImage;