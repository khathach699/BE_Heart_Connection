import { Router } from "express";
import roleController from "../controllers/roleController";

const router = Router();
router.get("/", roleController.getAllRoles);
router.post("/", roleController.createRole);
export default router;