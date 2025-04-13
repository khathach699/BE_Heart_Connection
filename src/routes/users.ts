import { Router } from "express";

import { validate, ChangePasswordValidator } from "../utils/validator";
import { check_authentication } from "../utils/check_auth";
import { register } from "../controllers/authController";
import UserController from "../controllers/volunteerController";
const router = Router();
router.post("/register", register as unknown as any);

router.post(
  "/",
  UserController.createUser.bind(UserController) as unknown as any
); // tạo user
router.get(
  "/",
  UserController.getAllUsers.bind(UserController) as unknown as any
); // lấy danh sách user đã phân trang
router.post(
  "/detail",
  UserController.getUserById.bind(UserController) as unknown as any
); // lấy chi tiết user
router.put(
  "/",
  UserController.updateUser.bind(UserController) as unknown as any
); // cập nhật user
router.delete(
  "/:id",
  UserController.deleteUser.bind(UserController) as unknown as any
); // xóa user

router.post(
  "/change_password",
  ChangePasswordValidator,
  check_authentication,
  validate,
  UserController.changePassword.bind(UserController) as unknown as any
);

// Upload avatar route
router.post(
  "/upload-avatar/:userId",
  UserController.uploadAvatar.bind(UserController) as unknown as any
);

// Get featured users
router.get(
  "/featured",
  UserController.getFeaturedUsers.bind(UserController) as unknown as any
);

export default router;
