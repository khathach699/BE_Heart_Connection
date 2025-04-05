import { Router } from "express";
import { register, login } from "../controllers/userController";
import { validate, SignupValidator, LoginValidator } from "../utils/validator";

const router = Router();
router.post("/register", SignupValidator, validate, register as unknown as any);
router.post("/login", LoginValidator, validate, login as unknown as any);

export default router;
