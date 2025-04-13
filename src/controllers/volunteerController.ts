import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import { Change_Password } from "../services/authService";
import { CreateErrorResponse } from "../utils/responnseHandler";
import { CreateSuccessResponse } from "../utils/responnseHandler";

import axios from "axios";
import fs from "fs";
import path from "path";
import multer from "multer";
import FormData from "form-data";

// Extend Express Request type to include user property
declare module "express" {
  interface Request {
    user?: any;
  }
}

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

// Setup for avatar upload
const avatarDir = path.join(__dirname, "../../avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const serverCDN = "http://localhost:4000/upload";
// @server-cdn - URL để xóa avatar cũ khi cập nhật
const serverCDNDelete = "http://localhost:4000/images";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
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

// @server-cdn - Hàm trích xuất tên file từ URL avatar để xóa ảnh cũ
const getFilenameFromUrl = (url: string): string | null => {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;
      const newUser = await userService.createUser(userData);
      return CreateSuccessResponse(res, 200, {
        newUser,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isdeleted = req.query.isdeleted as string;
      const result = await userService.getAllUsers(page, limit, isdeleted); //Thêm isdeleted vào đây để check xóa hay không
      return CreateSuccessResponse(res, 200, {
        result,
      });
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const user = await userService.getUserById(id);
      return CreateSuccessResponse(res, 200, {
        user,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const user = await userService.updateUser(id, req.body as Partial<IUser>);
      return CreateSuccessResponse(res, 200, {
        user,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deleteUser = await userService.deleteUser(id);
      return CreateSuccessResponse(res, 200, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  changePassword = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { oldPassword, newPassword } = req.body as ChangePasswordRequestBody;
    try {
      let result = await Change_Password(req.user, oldPassword, newPassword);
      return CreateSuccessResponse(res, 200, {
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return CreateErrorResponse(res, 400, error.message);
    }
  };

  // Method to handle avatar upload
  uploadAvatar = async function (req: Request, res: Response) {
    try {
      const multerSingle = upload.single("avatar");

      multerSingle(req, res, async (err: any) => {
        if (err) {
          return CreateErrorResponse(res, 400, err.message);
        }

        if (!req.file) {
          return CreateErrorResponse(res, 400, "Không có file được tải lên");
        }

        const imgPath = path.join(avatarDir, req.file.filename);

        try {
          // @server-cdn - Lấy thông tin user và tên file avatar cũ để xóa sau khi update
          const userId = req.params.userId;
          const user = await userService.getUserById(userId);
          const oldAvatarFilename = getFilenameFromUrl(user.avatar || "");

          // Create form data to send to CDN server
          const formData = new FormData();
          formData.append("avatar", fs.createReadStream(imgPath));

          // Post to CDN server
          const result = await axios.post(serverCDN, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Remove the temporary file
          fs.unlinkSync(imgPath);

          if (!result.data.success) {
            return CreateErrorResponse(
              res,
              500,
              "Lỗi khi tải ảnh lên server CDN"
            );
          }

          // Update user avatar URL in database
          const updatedUser = await userService.updateUser(userId, {
            avatar: result.data.data,
          });

          // @server-cdn - Xóa avatar cũ sau khi update thành công avatar mới
          if (oldAvatarFilename && oldAvatarFilename !== "no_user.jpg") {
            try {
              // @server-cdn - Gửi request xóa file avatar cũ khỏi thư mục images
              await axios.delete(`${serverCDNDelete}/${oldAvatarFilename}`);
              console.log(
                `@server-cdn - Đã xóa avatar cũ: ${oldAvatarFilename}`
              );
            } catch (deleteError) {
              console.error(
                "@server-cdn - Lỗi khi xóa avatar cũ:",
                deleteError
              );
              // @server-cdn - Vẫn tiếp tục xử lý ngay cả khi không xóa được avatar cũ
            }
          }

          return CreateSuccessResponse(res, 200, {
            message: "Avatar updated successfully",
            user: updatedUser,
            avatarUrl: result.data.data,
          });
        } catch (error) {
          // Clean up file in case of error
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
          return CreateErrorResponse(res, 500, (error as Error).message);
        }
      });
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  };

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserById(userId);
      return CreateSuccessResponse(res, 200, user);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async getFeaturedUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const featuredUsers = await userService.getFeaturedUsers(limit);
      return CreateSuccessResponse(res, 200, {
        featuredUsers,
      });
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}
export default new UserController();
