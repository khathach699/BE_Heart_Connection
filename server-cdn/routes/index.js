var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const {
  CreateSuccessResponse,
  CreateErrorResponse,
} = require("../utils/responnseHandler");

const avatarDir = path.join(__dirname, "../images");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}
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

// @server-cdn - Middleware xử lý cả hai loại field: 'avatar' hoặc 'images'
const uploadMiddleware = (req, res, next) => {
  // Kiểm tra xem request có chứa field 'avatar' hay không
  const hasAvatarField =
    req.get("content-type")?.includes("multipart/form-data") &&
    req.headers["content-type"]?.includes("boundary=") &&
    req.headers["content-disposition"]?.includes('name="avatar"');

  if (hasAvatarField) {
    // Nếu là avatar, sử dụng single upload
    upload.single("avatar")(req, res, next);
  } else {
    // Mặc định sử dụng array upload cho 'images'
    upload.array("images", 5)(req, res, next);
  }
};

router.post("/upload", (req, res, next) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return CreateErrorResponse(res, 400, err.message);
    }

    console.log("Received files:", req.files);
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return CreateErrorResponse(res, 400, "Không có file nào được tải lên");
      }

      if (files.length === 1) {
        // Nếu chỉ có một file, trả về URL đơn
        const avatarURL = `${authURL}${files[0].filename}`;
        return CreateSuccessResponse(res, 200, avatarURL);
      } else {
        // Nếu có nhiều files, trả về mảng URLs
        const avatarUrls = files.map((file) => `${authURL}${file.filename}`);
        return CreateSuccessResponse(res, 200, {
          message: "Upload thành công",
          urls: avatarUrls,
        });
      }
    } catch (error) {
      console.error("Processing error:", error);
      return CreateErrorResponse(
        res,
        500,
        error.message || "Lỗi khi xử lý file"
      );
    }
  });
});

//Cam xoa
router.post("/uploadmultiple", upload.array("images", 5), async (req, res, next) => {
  console.log("Received files:", req.files);
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return next(CreateErrorResponse(res, 400, "Không có file nào được tải lên"));
    }

    const avatarUrls = files.map(file => `${authURL}${file.filename}`);
    CreateSuccessResponse(res, 200, {
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

// @server-cdn - Xóa một file ảnh cụ thể
router.delete("/images/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(avatarDir, filename);

    if (!fs.existsSync(filePath)) {
      return CreateErrorResponse(res, 404, "File không tồn tại");
    }

    fs.unlinkSync(filePath);
    return CreateSuccessResponse(res, 200, {
      message: "Đã xóa file thành công",
      filename: filename,
    });
  } catch (error) {
    return CreateErrorResponse(res, 500, error.message || "Lỗi khi xóa file");
  }
});

// @server-cdn - API để dọn dẹp ảnh cũ
router.delete("/cleanup", (req, res) => {
  try {
    const { olderThan, excludeFiles } = req.body;
    const cutoffDate = olderThan
      ? new Date(olderThan)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Mặc định 30 ngày
    const excludeList = excludeFiles || [];

    const files = fs.readdirSync(avatarDir);
    const deletedFiles = [];

    files.forEach((file) => {
      const filePath = path.join(avatarDir, file);
      const stats = fs.statSync(filePath);

      // Nếu file cũ hơn cutoff date và không nằm trong exclude list
      if (stats.mtime < cutoffDate && !excludeList.includes(file)) {
        fs.unlinkSync(filePath);
        deletedFiles.push(file);
      }
    });

    return CreateSuccessResponse(res, 200, {
      message: `Đã xóa ${deletedFiles.length} files`,
      deletedFiles: deletedFiles,
    });
  } catch (error) {
    return CreateErrorResponse(
      res,
      500,
      error.message || "Lỗi khi dọn dẹp files"
    );
  }
});

module.exports = router;
