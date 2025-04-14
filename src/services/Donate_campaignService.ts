import { model } from "mongoose";
import Donate_campaign from "../schemas/Donate_campaign";
import {
  IDonateCampaign,
  IDonateCampaignDocument,
} from "../types/Donate_campaign";
import { populate } from "dotenv";

export class Donate_campaignService {
  async saveDonatedInfo(
    donatedInfo: IDonateCampaign
  ): Promise<IDonateCampaign> {
    try {
      const newDonateInfo = new Donate_campaign(donatedInfo);
      return (await newDonateInfo.save()) as unknown as IDonateCampaignDocument;
    } catch (error) {
      throw new Error(
        `Error creating donate info: ${(error as Error).message}`
      );
    }
  }

  async getAllDonateInfo(page: number = 1, limit: number = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: "user", select: "fullname" },
          {
            path: "campaign",
            model: "Campaign",
            select: "name",
            populate: {
              path: "organization",
              model: "Organization",
              select: "info",
            },
          },
        ],
      };
      const result = await (Donate_campaign as any).paginate(
        { isdeleted: false },
        options
      );
      if (page > result.totalPages && result.totalDocs > 0) {
        throw new Error("Page not found");
      }
      return {
        donateInfos: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(
        `Error fetching donate info: ${(error as Error).message}`
      );
    }
  }
  async getDonatedInfoById(id: string): Promise<IDonateCampaignDocument> {
    try {
      const donateInfo = await Donate_campaign.findOne({
        _id: id,
        isdeleted: false,
      }).populate([
        { path: "user", select: "fullname" },
        {
          path: "campaign",
          model: "Campaign",
          select: "name",
          populate: {
            path: "organization",
            model: "Organization",
            select: "info",
          },
        },
      ]);
      if (!donateInfo) throw new Error("Donate not found");
      return donateInfo as unknown as IDonateCampaignDocument;
    } catch (error) {
      throw new Error(
        `Error fetching donate info: ${(error as Error).message}`
      );
    }
  }
  async updateDonateInfo(
    id: string,
    donateInfo: Partial<IDonateCampaign>
  ): Promise<IDonateCampaignDocument> {
    try {
      const donate = await Donate_campaign.findOneAndUpdate(
        { _id: id, isdeleted: false },
        donateInfo,
        { new: true }
      );
      if (!donate) throw new Error("Donate not found");
      return donate as unknown as IDonateCampaignDocument;
    } catch (error) {
      throw new Error(
        `Error updating donate info: ${(error as Error).message}`
      );
    }
  }
  async deleteDonate(id: string): Promise<IDonateCampaignDocument> {
    try {
      const donate = await Donate_campaign.findOneAndUpdate(
        { _id: id, isdeleted: false },
        { isdeleted: true },
        { new: true }
      );
      if (!donate) throw new Error("Donate not found");
      return donate as unknown as IDonateCampaignDocument;
    } catch (error) {
      throw new Error(`Error deleting donate: ${(error as Error).message}`);
    }
  }
}

export default new Donate_campaignService();
