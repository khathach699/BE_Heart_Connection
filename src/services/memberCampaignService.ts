import mongoose from "mongoose";
import MemberCampaign from "../schemas/MemberCampaign";
import Campaign from "../schemas/Campaign";
import ImgCampain from "../schemas/ImgCampain";
import { IMemberCampaignDocument } from "../types/MemberCampaign";

export class MemberCampaignService {
  async getUserCampaigns(userId: mongoose.Types.ObjectId) {
    try {
      console.log("Searching for user ID:", userId);

      // Find all member-campaign records for the user
      const memberCampaigns = await MemberCampaign.find({
        UserID: userId,
        IsDelete: 0,
      });

      console.log("Found member campaigns:", memberCampaigns.length);

      // Không tìm thấy dữ liệu, kiểm tra collection MemberCampaign có dữ liệu không
      if (memberCampaigns.length === 0) {
        const allMemberCampaigns = await MemberCampaign.find({});
        console.log(
          "Total member campaigns in database:",
          allMemberCampaigns.length
        );

        if (allMemberCampaigns.length > 0) {
          console.log(
            "Sample UserIDs in database:",
            allMemberCampaigns.slice(0, 3).map((mc) => mc.UserID)
          );
        }
      }

      // Get campaign details for each member-campaign record
      const campaignsWithDetails = await Promise.all(
        memberCampaigns.map(async (mc) => {
          console.log("Processing campaign with ID:", mc.CampID);

          const campaign = await Campaign.findOne({
            _id: mc.CampID,
            isdeleted: false,
          })
            .populate("organization")
            .setOptions({ strictPopulate: false });

          console.log("Found campaign:", campaign ? "Yes" : "No");

          // Get campaign images
          const images = await ImgCampain.find({
            CampID: mc.CampID,
            isdeleted: false,
          });

          console.log("Found images:", images.length);

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
      console.error("Error in getUserCampaigns:", error);
      throw new Error(
        `Error fetching user campaigns: ${(error as Error).message}`
      );
    }
  }
}

export default new MemberCampaignService();
