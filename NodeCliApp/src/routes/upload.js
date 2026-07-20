const express = require("express");
const upload = require("../middleware/upload");
const { uploadAvatar, uploadImages, serveImg, deleteImg } = require("../controllers/uploadController");
const protect = require("../middleware/authProvider");
const router = express.Router();

router.post("/", protect,upload.single("avatar"), uploadAvatar);
router.post("/gallery",protect, upload.array('images',5), uploadImages);
router.get('/:filename',serveImg)
router.delete('/:filename',protect,deleteImg)

module.exports=router;