const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "..", "/uploads");
// console.log('path',p);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const userId = req.user.id;
    const ext = path.extname(file.originalname);
    console.log(userId);
    console.log(ext);
    
    
    cb(null, userId +"-"+ Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only jpg, png and webp images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
module.exports = upload;
