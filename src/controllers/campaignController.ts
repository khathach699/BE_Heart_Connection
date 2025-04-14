import { NextFunction, Request, Response } from "express";
import campaignService from "../services/campaignService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";
import { ICampaign } from "../types/Campagin";

export class CampaignController {
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

  async getFeaturedCampaigns(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 7;
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

  async approveCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw CreateErrorResponse(res, 400, "Campaign ID is required");
      }

      const campaign = await campaignService.approveCampaign(campaignId);
      CreateSuccessResponse(res, 200, {
        message: "Campaign request approved",
        campaign,
      });
    } catch (error) {
      CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async rejectCampaign(req: Request, res: Response) {
    try {
      const campaignId = req.params.id;
      if (!campaignId) {
        throw CreateErrorResponse(res, 400, "Campaign ID is required");
      }
      const campaign = await campaignService.rejectCampaign(campaignId);
      CreateSuccessResponse(res, 200, {
        message: "Campaign request rejected",
        campaign,
      });
    } catch (error) {
      CreateErrorResponse(res, 400, (error as Error).message);
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
      CreateSuccessResponse(res, 200, result);
    } catch (error) {
      CreateErrorResponse(res, 500, (error as Error).message);
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
      CreateSuccessResponse(res, 200, result);
    } catch (error) {
      CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
  async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const campaignData: Partial<ICampaign> = req.body;
      if (!req.user) {
        throw new Error("User không được xác thực");
      }

      // const organization = req.user.organization;
      // if (!organization) {
      //   throw new Error("User không có organization");
      // }

      const fullCampaignData: ICampaign = {
        ...campaignData,
        // organization: organization,
      } as ICampaign;
      const result = await campaignService.createCampaignWithImages(
        fullCampaignData,
        files
      );

      CreateSuccessResponse(res, 201, result);
    } catch (error) {
      if (req.files) {
        campaignService.cleanupFiles(req.files as Express.Multer.File[]);
      }
      next(error);
    }
  }
  async searchCampaigns(req: Request, res: Response) {
    try {
      const search = req.query.search;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await campaignService.searchCampaign(
        search as string,
        page,
        limit
      );
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}

export default new CampaignController();
