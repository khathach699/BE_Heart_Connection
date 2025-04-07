import express, { RequestHandler } from "express";
import memberCampaignController from "../controllers/memberCampaignController";

const router = express.Router();

// Get campaigns for a specific user
router.post(
  "/user",
  memberCampaignController.getUserCampaigns as unknown as RequestHandler
);

export default router;
