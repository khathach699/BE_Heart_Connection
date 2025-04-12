var express = require('express');
var router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { CreateSuccessResponse, CreateErrorResponse} = require("../utils/responnseHandler");

const avatarDir = path.join(__dirname, "../images");
const authURL = "http://localhost:4000/images/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ nhận file ảnh!"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload", upload.array("images", 5), async (req, res, next) => {
  console.log("Received files:", req.files);
  try {
    const files = req.files; 
    if (!files || files.length === 0) {
      return next(CreateErrorResponse(res, 400, "Không có file nào được tải lên"));
    }

    const avatarUrls = files.map(file => `${authURL}${file.filename}`);
    CreateSuccessResponse(res,200,{
      message: "Upload thành công",
      urls: avatarUrls,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/images/:filename", (req, res, next) => {
  const pathAvatar = path.join(avatarDir, req.params.filename);
  if (!fs.existsSync(pathAvatar)) {
    return next(CreateErrorResponse(res, 404, "File không tồn tại"));
  }
  res.sendFile(pathAvatar);
});
module.exports = router;
