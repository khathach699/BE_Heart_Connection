import mongoose from "mongoose";
import MemberCampaign from "../schemas/MemberCampaign";
import Campaign from "../schemas/Campaign";
import ImgCampain from "../schemas/ImgCampain";
import { IMemberCampaignDocument } from "../types/MemberCampaign";

export class MemberCampaignService {
  async getUserCampaigns(userId: mongoose.Types.ObjectId) {
    try {
      // Find all member-campaign records for the user
      const memberCampaigns = await MemberCampaign.find({
        UserID: userId,
        IsDelete: 0,
      });

      // Không tìm thấy dữ liệu, kiểm tra collection MemberCampaign có dữ liệu không
      if (memberCampaigns.length === 0) {
        const allMemberCampaigns = await MemberCampaign.find({});
      }

      // Get campaign details for each member-campaign record
      const campaignsWithDetails = await Promise.all(
        memberCampaigns.map(async (mc) => {
          const campaign = await Campaign.findOne({
            _id: mc.CampID,
            isdeleted: false,
          })
            .populate("organization")
            .setOptions({ strictPopulate: false });

          // Get campaign images
          const images = await ImgCampain.find({
            CampID: mc.CampID,
            isdeleted: false,
          });

          return {
            ...mc.toObject(),
            campaign: campaign
              ? {
                  ...campaign.toObject(),
                  images: images,
                }
              : null,
          };
        })
      );

      return campaignsWithDetails;
    } catch (error) {
      throw new Error(
        `Error fetching user campaigns: ${(error as Error).message}`
      );
    }
  }
}

export default new MemberCampaignService();
