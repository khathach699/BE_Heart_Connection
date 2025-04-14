import { Request, Response } from "express";
import { IDonateCampaign } from "../types/Donate_campaign";
import Donate_campaignService from "../services/Donate_campaignService";
import campaignService from "../services/campaignService";
import userService from "../services/userService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

export class Donate_campaignController {
  async createDonate(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const donateData = {
        ...req.body,
        user: userId,
      };
      const result = await Donate_campaignService.saveDonatedInfo(donateData);

      await campaignService.updateCampaignDonate(
        donateData.campaign.toString(),
        donateData.money
      );
      await userService.updateUserPoint(userId);
      return CreateSuccessResponse(res, 201, result);
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async getAllDonate(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await Donate_campaignService.getAllDonateInfo(page, limit);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async getDonateById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const donate = await Donate_campaignService.getDonatedInfoById(id);
      return CreateSuccessResponse(res, 200, donate);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async updateDonate(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const donate = await Donate_campaignService.updateDonateInfo(
        id,
        req.body as Partial<IDonateCampaign>
      );
      return CreateSuccessResponse(res, 200, {
        message: "Donate info updated successfully",
        donate,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async deleteDonate(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedDonate = await Donate_campaignService.deleteDonate(id);
      return CreateSuccessResponse(res, 200, {
        message: "Donate deleted successfully",
        donate: deletedDonate,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
}

export default new Donate_campaignController();
