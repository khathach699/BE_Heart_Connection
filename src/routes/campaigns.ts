import express from "express";
import campaignController from "../controllers/campaignController";

const router = express.Router();
router.put(
  "/approve/:id",
  campaignController.approveCampaign.bind(campaignController)
);
router.put(
  "/reject/:id",
  campaignController.rejectCampaign.bind(campaignController)
);
router.get("/", campaignController.getAllCampaigns.bind(campaignController));
router.get(
  "/rejected",
  campaignController.getAllCampaignsWasReject.bind(campaignController)
);
router.get(
  "/featured",
  campaignController.getFeaturedCampaigns.bind(campaignController)
);
router.get(
  "/featured-activities",
  campaignController.getFeaturedActivities.bind(campaignController)
);
router.get("/:id", campaignController.getCampaignById.bind(campaignController));
router.delete(
  "/:id",
  campaignController.deleteCampaign.bind(campaignController)
);
export default router;
