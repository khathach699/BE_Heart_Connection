import { Router } from "express";
import TagController from "../controllers/TagController";
const router = Router();
router.post("/", TagController.createTag as unknown as any); 
router.get("/", TagController.getAllTags as unknown as any); 
router.get("/:id", TagController.getTagById as unknown as any); 
router.put("/:id", TagController.updateTag as unknown as any);
router.delete("/:id", TagController.deleteTag as unknown as any);
export default router;
