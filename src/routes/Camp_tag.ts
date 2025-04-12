import { Router } from "express";
import CamTagController from "../controllers/Camp_tagController";
const router = Router();
router.post("/", CamTagController.createCampTag as unknown as any); 
router.get("/", CamTagController.getAllCampTags as unknown as any); 
router.get("/:id", CamTagController.getCampTagById as unknown as any); 
router.put("/:id", CamTagController.updateCampTag as unknown as any);
router.delete("/:id", CamTagController.deleteCampTag as unknown as any);
export default router;
