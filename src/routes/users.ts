import { Router } from "express";
import { changePassword } from "../controllers/userController";
import { validate, ChangePasswordValidator } from "../utils/validator";
import { check_authentication } from "../utils/check_auth";
import { register } from "../controllers/authController";
import UserController from "../controllers/volunteerController";
const router = Router();
router.post("/register", register as unknown as any);

router.post("/", UserController.createUser.bind(UserController)); 
router.get("/", UserController.getAllUsers.bind(UserController)); 
router.post("/detail", UserController.getUserById.bind(UserController)); 
router.put("/", UserController.updateUser.bind(UserController)); 
router.delete("/:id", UserController.deleteUser.bind(UserController)); 

router.get("/me", check_authentication, UserController.getCurrentUser.bind(UserController)); 
router.get("/my-campaigns", check_authentication, UserController.getUserCampaigns.bind(UserController)); 

router.post(
  "/change_password",
  ChangePasswordValidator,
  check_authentication,
  validate,
  changePassword as unknown as any
);

export default router;
