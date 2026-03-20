import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.zip', '.png', '.jpg', '.jpeg', '.docx', '.doc', '.ppt', '.pptx', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    console.log("Multer Filtering file:", file.originalname, "Ext:", ext);
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type! Use PDF, ZIP, DOCX, DOC, PPT, PPTX or Images."), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: fileFilter
});
