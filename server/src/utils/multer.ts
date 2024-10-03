import multer from 'multer';

const storage = multer.memoryStorage(); 

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
}).fields([{ name: 'images', maxCount: 4 }, { name: 'companyLogo', maxCount: 1 }]); 

export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
}).single('image');