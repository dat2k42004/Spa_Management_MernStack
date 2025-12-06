import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../config/cloudinary.js";

import multer from "multer";


const uploadCloud = (folder) => {

     // storage config
     const storage = new CloudinaryStorage({
          cloudinary,
          params: {
               folder: `uploads/${folder}`,
               allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          },
     });

     return multer({
          storage,
          limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
     });
}

export default uploadCloud;