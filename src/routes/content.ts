import { Router } from "express";
import contentController from "../controllers/contentController";
import { check_authentication } from "../utils/check_auth";

const router = Router();

router.post("/", contentController.createContent as unknown as any);
router.get("/", contentController.getAllContent as unknown as any);
router.get("/:id", contentController.getContentById as unknown as any);
router.put("/:id", contentController.updateContent as unknown as any);
router.delete("/:id", contentController.deleteContent as unknown as any);

export default router;
