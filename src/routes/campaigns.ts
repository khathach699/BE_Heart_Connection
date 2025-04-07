import express from "express";
import campaignController from "../controllers/campaignController";

const router = express.Router();
router.put("/approve/:id", campaignController.approveCampaign as unknown as any);
router.put("/reject/:id", campaignController.rejectCampaign as unknown as any);
router.get("/", campaignController.getAllCampaigns as unknown as any);
router.get("/rejected", campaignController.getAllCampaignsWasReject as unknown as any);
router.get("/:id", campaignController.getCampaignById as unknown as any);
router.delete("/:id", campaignController.deleteCampaign as unknown as any);
export default router;