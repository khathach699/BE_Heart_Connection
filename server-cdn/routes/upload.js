var express = require("express");
var router = express.Router();
let multer = require("multer");
let path = require("path");
let fs = require("fs");
let {
  CreateSuccessResponse,
  CreateErrorResponse,
} = require("../utils/responnseHandler");

// @server-cdn
// Create avatars directory if it doesn't exist
const avatarDir = path.join(__dirname, "../public/avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const baseURL = "http://localhost:4000/avatars/";

// Configure storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) =>
    cb(null, new Date(Date.now()).getTime() + "-" + file.originalname),
});

// Configure upload middleware
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match("image")) {
      cb(new Error("Chỉ chấp nhận file ảnh"));
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Handle avatar upload
router.post("/", upload.single("avatar"), async function (req, res, next) {
  try {
    if (!req.file) {
      return CreateErrorResponse(res, 400, "Không có file được tải lên");
    }

    const avatarURL = baseURL + req.file.filename;

    return CreateSuccessResponse(res, 200, avatarURL);
  } catch (error) {
    return CreateErrorResponse(
      res,
      500,
      error.message || "Lỗi khi tải ảnh lên"
    );
  }
});

// Serve avatar files
router.get("/avatars/:filename", function (req, res, next) {
  const pathAvatar = path.join(avatarDir, req.params.filename);
  res.sendFile(pathAvatar);
});

module.exports = router;
