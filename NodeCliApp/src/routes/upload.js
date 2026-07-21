const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadAvatar,
  uploadImages,
  serveImg,
  deleteImg,
} = require("../controllers/uploadController");
const protect = require("../middleware/authProvider");
const asyncHanlder = require("../middleware/asyncHandler");
const router = express.Router();

router.post("/", protect, upload.single("avatar"), asyncHanlder(uploadAvatar));
router.post(
  "/gallery",
  protect,
  upload.array("images", 5),
  asyncHanlder(uploadImages),
);
router.get("/:filename", asyncHanlder(serveImg));
router.delete("/:filename", protect, asyncHanlder(deleteImg));

module.exports = router;
