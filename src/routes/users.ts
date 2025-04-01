import { Router } from "express";
import { register } from "../controllers/userController";
import UserController from "../controllers/volunteerController";
const router = Router();
router.post("/register", register);
//
router.post("/", UserController.createUser.bind(UserController)); // tạo user
router.get("/", UserController.getAllUsers.bind(UserController)); // lấy danh sách user đã phân trang
router.post("/detail", UserController.getUserById.bind(UserController)); // lấy chi tiết user
router.put("/", UserController.updateUser.bind(UserController)); // cập nhật user
router.delete("/:id", UserController.deleteUser.bind(UserController)); // xóa user
export default router;
