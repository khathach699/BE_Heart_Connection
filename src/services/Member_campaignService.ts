import path from "path";
import { IMemberCampaign, IMemberCampaignDocument } from "../types/Member_campaign";
import MemberCampaign from "../schemas/Member_campaign";
import mongoose, { model } from "mongoose";
import { populate } from "dotenv";
import Campaign from "../schemas/Campaign";
import ImgCampain from "../schemas/ImgCampain";
import { selectFields } from "express-validator/lib/field-selection";

export class Member_campaignService {
  async saveParticipant(userInfo: IMemberCampaign): Promise<IMemberCampaignDocument> {
    try {
      const existingParticipant = await MemberCampaign.findOne({
        user: userInfo.user,
        campaign: userInfo.campaign,
        isdeleted: false
      });

      if (existingParticipant) {
        throw new Error("User has already joined this campaign");
      }

      const newUser = new MemberCampaign(userInfo);
      return (await newUser.save()) as unknown as IMemberCampaignDocument;
    } catch (error) {
      throw new Error(`Error creating Participant: ${(error as Error).message}`);
    }
  }
  
  async getAllActivity(page: number = 1, limit: number = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          {path: "user"},
          {
            path: "campaign",
            populate: {
              path: "organization",
              model: "Organization",     
              select: "info"       
            }
          },
          {path: "state", select : "name"},
        ]
      };
      const result = await (MemberCampaign as any).paginate(
        { isdeleted: false },
        options
      );
      if (page > result.totalPages && result.totalDocs > 0) {
        throw new Error("Page not found");
      }
      return {
        Activity: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(`Error fetching Participant: ${(error as Error).message}`);
    }
  }
  async getParticipantById(id: string): Promise<IMemberCampaignDocument> {
    try {
      const userInfo = await MemberCampaign.findOne({ _id: id, isdeleted: false }).populate("user").populate("campaign").populate("state");
      if (!userInfo) throw new Error("Participant not found");
      return userInfo as unknown as IMemberCampaignDocument;
    } catch (error) {
      throw new Error(`Error fetching Participant: ${(error as Error).message}`);
    }
  }
  async updateParticipantInfo(
    id: string,
    userInfo: Partial<IMemberCampaign>
  ): Promise<IMemberCampaignDocument> {
    try {
      const user = await MemberCampaign.findOneAndUpdate(
        { _id: id, isdeleted: false },
        userInfo,
        { new: true }
      );
      if (!user) throw new Error("Participant not found");
      return user as unknown as IMemberCampaignDocument;
    } catch (error) {
      throw new Error(`Error updating Participant: ${(error as Error).message}`);
    }
  }
  async deleteParticipant(id: string): Promise<IMemberCampaignDocument> {
    try {
      const user = await MemberCampaign.findOneAndUpdate(
        { _id: id, isdeleted: false },
        { isdeleted: true },
        { new: true }
      );
      if (!user) throw new Error("Participant not found");
      return user as unknown as IMemberCampaignDocument;
    } catch (error) {
      throw new Error(`Error deleting Participant: ${(error as Error).message}`);
    }
  }
  async getUserCampaigns(userId: string, page: number = 1, limit: number = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          {
            path: "campaign",
            model : "Campaign",
            select: "name organization content",
            populate: [
              {
                path: "organization",
                model: "Organization",
                select: "info"
              },
              {
                path: "img"
              }
            ]
          },
          {
            path: "user",
            model: "User",
            select: "fullname",
          },
          {path: "state", select: "name"}
        ]
      };
      
      const result = await (MemberCampaign as any).paginate(
        { user: userId, isdeleted: false },
        options
      );
      
      if (page > result.totalPages && result.totalDocs > 0) {
        throw new Error("Page not found");
      }
      
      return {
        participated: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(`Error fetching user campaigns: ${(error as Error).message}`);
    }
  }
}

export default new Member_campaignService();
