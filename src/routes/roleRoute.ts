import { Router } from "express";
import roleController from "../controllers/roleController";

const router = Router();
router.get("/", roleController.getAllRoles as unknown as any);
router.post("/", roleController.createRole as unknown as any);
export default router;