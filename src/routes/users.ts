import { Router } from "express";
import { changePassword } from "../controllers/userController";
import { validate, ChangePasswordValidator } from "../utils/validator";
import { check_authentication } from "../utils/check_auth";
import { register } from "../controllers/authController";
import UserController from "../controllers/volunteerController";
const router = Router();
router.post("/register", register as unknown as any);

router.post("/", UserController.createUser.bind(UserController)); // tạo user
router.get("/", UserController.getAllUsers.bind(UserController)); // lấy danh sách user đã phân trang
router.post("/detail", UserController.getUserById.bind(UserController)); // lấy chi tiết user
router.put("/", UserController.updateUser.bind(UserController)); // cập nhật user
router.delete("/:id", UserController.deleteUser.bind(UserController)); // xóa user

router.post(
  "/change_password",
  ChangePasswordValidator,
  check_authentication,
  validate,
  changePassword as unknown as any
);

export default router;
