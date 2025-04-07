import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { validate, SignupValidator, LoginValidator } from "../utils/validator";

const router = Router();
router.post("/register", SignupValidator, validate, register as unknown as any);
router.post("/login", LoginValidator, validate, login as unknown as any);
router.post("/logout", logout as unknown as any);
router.post("/forgot-password", forgotPassword as unknown as any);
router.post("/reset-password", resetPassword as unknown as any);

export default router;
