import { Router } from "express";
import { changePassword } from "../controllers/userController";
import { validate, ChangePasswordValidator } from "../utils/validator";
import { check_authentication } from "../utils/check_auth";

const router = Router();
router.post(
  "/change_password",
  ChangePasswordValidator,
  check_authentication,
  validate,
  changePassword as unknown as any
);

export default router;
