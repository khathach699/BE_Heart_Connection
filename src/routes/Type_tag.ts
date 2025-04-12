import { Router } from "express";
import TypetagController from "../controllers/Type_tagController";
const router = Router();
router.post("/", TypetagController.createTypeTag as unknown as any); 
router.get("/", TypetagController.getAllTypeTags as unknown as any); 
router.get("/:id", TypetagController.getTypeTagById as unknown as any); 
router.put("/:id", TypetagController.updateTypeTag as unknown as any);
router.delete("/:id", TypetagController.deleteTypeTag as unknown as any);
export default router;
