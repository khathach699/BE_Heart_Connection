import { Request, Response } from "express";
import campaignService from "../services/campaignService";
import userService from "../services/userService";
import Member_CampaignService from "../services/Member_campaignService";
import { IMemberCampaign } from "../types/Member_campaign";
import StateSchema from "../schemas/State";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

export class Member_campaignController {
  async participate(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const uncompletedState = await StateSchema.findOne({
        name: "Uncompleted",
      });

      if (!uncompletedState) {
        throw new Error("Default state not found");
      }

      const participantData = {
        ...req.body,
        user: userId,
        state: uncompletedState._id,
      };

      const result = await Member_CampaignService.saveParticipant(
        participantData
      );

      await campaignService.updateCampaignParticipant(
        participantData.campaign.toString()
      );
      await userService.updateUserPoint(userId);
      return CreateSuccessResponse(res, 201, result);
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async getAllActivity(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await Member_CampaignService.getAllActivity(page, limit);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async getParticipantById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const participant = await Member_CampaignService.getParticipantById(id);
      return CreateSuccessResponse(res, 200, participant);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async updateParticipant(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const participant = await Member_CampaignService.updateParticipantInfo(
        id,
        req.body as Partial<IMemberCampaign>
      );
      return CreateSuccessResponse(res, 200, {
        message: "Participant updated successfully",
        participant,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async deleteParticipant(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedParticipant = await Member_CampaignService.deleteParticipant(
        id
      );
      return CreateSuccessResponse(res, 200, {
        message: "Participant deleted successfully",
        participant: deletedParticipant,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  async getUserCampaigns(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const campaignsResult = await Member_CampaignService.getUserCampaigns(
        userId
      );
      return CreateSuccessResponse(res, 200, campaignsResult);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}

export default new Member_campaignController();
