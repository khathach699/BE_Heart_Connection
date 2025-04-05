import { Router } from "express";

import { CreateRole } from "../controllers/rolerController";
const router = Router();
router.post("/create-role", CreateRole as unknown as any);

export default router;
