import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  url: process.env.CLOUDINARY_URL 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'png', 'jpeg','webp', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

export const uploadProfileImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('profileImage');

export const uploadDriverImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 }
]);