import { Request, Response } from "express";
import campaignService from "../services/campaignService";
import {
  CreateErrorResponse,
  CreateSuccessResponse,
} from "../utils/responnseHandler";
export class CampaignController {
  async approveCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw res.status(400).json({ message: "Campaign ID is required" });
      }

      const campaign = await campaignService.approveCampaign(campaignId);
      res.status(200).json({ message: "Campaign approved", campaign });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async rejectCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw res.status(400).json({ message: "Campaign ID is required" });
      }
      const campaign = await campaignService.rejectCampaign(campaignId);
      res.status(200).json({ message: "Campaign request rejected", campaign });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async getAllCampaigns(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isAccepted =
        req.query.isAccepted === "true"
          ? true
          : req.query.isAccepted === "false"
          ? false
          : undefined;

      const result = await campaignService.getAllCampaigns(
        page,
        limit,
        isAccepted
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async getCampaignById(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw res.status(400).json({ message: "Campaign ID is required" });
      }

      const campaign = await campaignService.getCampaignById(campaignId);
      res.status(200).json(campaign);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
  async deleteCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw res.status(400).json({ message: "Campaign ID is required" });
      }
      const campaign = await campaignService.deleteCampaign(campaignId);
      res.status(200).json({ message: "Campaign deleted", campaign });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
  async getAllCampaignsWasReject(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await campaignService.getAllCampaignsWasReject(
        page,
        limit
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async getFeaturedCampaigns(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const featuredCampaigns = await campaignService.getFeaturedCampaigns(
        limit
      );
      CreateSuccessResponse(res, 200, featuredCampaigns);
    } catch (error) {
      CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
  async getFeaturedActivities(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 3;

      const featuredActivities = await campaignService.getFeaturedActivities(
        limit
      );

      CreateSuccessResponse(res, 200, featuredActivities);
    } catch (error) {
      CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}

export default new CampaignController();
