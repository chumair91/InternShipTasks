const path = require("path");
const fs = require("fs");
function uploadAvatar(req, res) {
  const file = req.file;

  res.json({ success: true, message: "avatar uploaded successfully", file });
}

function uploadImages(req, res) {
  const files = req.files;

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ message: "no images uploaded", success: false, files: [] });
  }

  res.status(201).json({ message: "images uploaded successfully", success: true, files });
}

function serveImg(req, res) {
  const fileName = req.params.filename;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: "FileName does not exist", success: false, files: [] });
  }

  const filePath = path.join(__dirname, "..", "..", "/uploads", fileName);
  if (!fs.existsSync(filePath)) {
    return res
      .status(400)
      .json({ message: "File does not exist", success: false });
  }
  res.sendFile(filePath);
  //   res.json({ message: "wait", success: true });
}

function deleteImg(req,res) {
  const fileName = req.params.filename;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: "FileName does not exist", success: false });
  }
  const filePath = path.join(__dirname, "..", "..", "/uploads", fileName);
  if (!fs.existsSync(filePath)) {
    return res
      .status(400)
      .json({ message: "File does not exist", success: false });
  }
  fs.unlinkSync(filePath);
  return res
    .status(200)
    .json({ message: "File deleted Successfully", success: true });
}
module.exports = { uploadAvatar, uploadImages, serveImg,deleteImg };
