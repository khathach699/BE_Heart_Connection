import { Router } from "express";
import { check_authentication } from "../utils/check_auth";
import Member_CampaignController from "../controllers/Member_campaignController";
const router = Router();
router.get("/", Member_CampaignController.getAllActivity as unknown as any);
router.post(
  "/:userId",
  check_authentication,
  Member_CampaignController.participate as unknown as any
);
router.put("/", Member_CampaignController.updateParticipant as unknown as any);
router.delete(
  "/:id",
  Member_CampaignController.deleteParticipant as unknown as any
);
router.get(
  "/my-campaign/:id",
  check_authentication,
  Member_CampaignController.getUserCampaigns as unknown as any
);
export default router;
