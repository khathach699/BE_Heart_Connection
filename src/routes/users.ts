import { Router } from "express";
import { changePassword } from "../controllers/userController";
import { validate, ChangePasswordValidator } from "../utils/validator";
import { check_authentication } from "../utils/check_auth";
import UserController from "../controllers/volunteerController";

const router = Router();

router.post("/", UserController.createUser as unknown as any);
router.get("/", UserController.getAllUsers as unknown as any);
router.post("/detail", UserController.getUserById as unknown as any);
router.put("/", UserController.updateUser as unknown as any);
router.delete("/:id", UserController.deleteUser as unknown as any);

router.get("/me", check_authentication, UserController.getCurrentUser as unknown as any);
router.get("/my-campaigns", check_authentication, UserController.getUserCampaigns as unknown as any);

router.post(
  "/change_password",
  ChangePasswordValidator,
  validate,
  changePassword as unknown as any
);

export default router;
