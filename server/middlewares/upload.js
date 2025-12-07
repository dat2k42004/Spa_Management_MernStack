import multer from "multer";
import path from "path";
import fs from "fs";


const upload = (folder) => {
     // create upload folder if not exists
     const uploadPath = `uploads/${folder}`;
     if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
     }

     // config multer storage
     const storage = multer.diskStorage({
          destination: (req, file, cb) => {
               cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
               const filename = Date.now() + "-" + file.originalname;
               cb(null, filename);
          }
     })
     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

     // config file filter
     const fileFilter = (req, file, cb) => {
          if (allowedTypes.includes(file.mimetype)) {
               cb(null, true);
          }
          else {
               cb(new Error("[upload] Invalid file type"));
          }
     }


     return multer({
          storage,
          fileFilter,
          limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
     });
}

// upload 1 file: upload("folder").single("fileName")
// upload multi files: upload("folder").array("fileName", maxCount)

export default upload;