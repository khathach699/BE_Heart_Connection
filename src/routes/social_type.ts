import { Router } from "express";
import SocialTypeController from "../controllers/social_typeController";
const router = Router();
router.post("/", SocialTypeController.createSocialType as unknown as any); 
router.get("/", SocialTypeController.getAllSocialTypes as unknown as any); 
router.get("/:id", SocialTypeController.getSocialTypeById as unknown as any); 
router.put("/:id", SocialTypeController.updateSocialType as unknown as any);
router.delete("/:id", SocialTypeController.deleteSocialType as unknown as any);
export default router;
