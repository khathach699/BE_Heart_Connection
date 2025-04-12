import { Request, Response } from "express";
import campaignService from "../services/campaignService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

export class CampaignController {
  async approveCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        return CreateErrorResponse(res, 400, "Campaign ID is required");
      }

      const campaign = await campaignService.approveCampaign(campaignId);
      return CreateSuccessResponse(res, 200, {
        message: "Campaign approved",
        campaign,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async rejectCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        return CreateErrorResponse(res, 400, "Campaign ID is required");
      }
      const campaign = await campaignService.rejectCampaign(campaignId);
      return CreateSuccessResponse(res, 200, {
        message: "Campaign request rejected",
        campaign,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
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
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async getCampaignById(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        return CreateErrorResponse(res, 400, "Campaign ID is required");
      }

      const campaign = await campaignService.getCampaignById(campaignId);
      return CreateSuccessResponse(res, 200, campaign);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        return CreateErrorResponse(res, 400, "Campaign ID is required");
      }
      const campaign = await campaignService.deleteCampaign(campaignId);
      return CreateSuccessResponse(res, 200, {
        message: "Campaign deleted",
        campaign,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
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
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
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
