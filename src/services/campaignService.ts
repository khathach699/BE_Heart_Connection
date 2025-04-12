import Campaign from "../schemas/Campaign";
import { ICampaign, ICampaignDocument } from "../types/Campagin";
import ImgCampain from "../schemas/ImgCampain";

export class CampaignService {
  async approveCampaign(campaignID: string): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findOne({
        _id: campaignID,
        isdeleted: false,
      });
      if (!campaign) throw new Error("Campaign not found");
      if (campaign.isAccepted) throw new Error("Campaign already accepted");
      campaign.isAccepted = true;
      await campaign.save();
      return campaign;
    } catch (error) {
      throw new Error(`Error approving campaign: ${(error as Error).message}`);
    }
  }
  async rejectCampaign(campaignId: string): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error("Campaign not found");
      if (campaign.isAccepted)
        throw new Error("Campaign already accepted, cannot be rejected");

      campaign.isdeleted = true;
      await campaign.save();

      return campaign;
    } catch (error) {
      throw new Error(`Error rejecting campaign: ${(error as Error).message}`);
    }
  }
  async getAllCampaigns(
    page: number = 1,
    limit: number = 10,
    isAccepted?: boolean
  ) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [{ path: "organization" }, { path: "state" }],
      };

      const query: any = { isdeleted: false };
      if (isAccepted !== undefined) {
        query.isAccepted = isAccepted;
      }

      const result = await Campaign.paginate(query, options);
      return {
        campaigns: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(`Error fetching campaigns: ${(error as Error).message}`);
    }
  }
  async getCampaignById(campaignId: string): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findOne({
        _id: campaignId,
        isdeleted: false,
      })
        .populate("organization")
        .populate("state");
      if (!campaign) throw new Error("Campaign not found");
      return campaign;
    } catch (error) {
      throw new Error(`Error fetching campaign: ${(error as Error).message}`);
    }
  }
  async deleteCampaign(campaignId: string) {
    try {
      const result = await Campaign.findOneAndUpdate(
        { _id: campaignId, isdeleted: false },
        { isdeleted: true },
        { new: true }
      );
      if (!result) {
        throw new Error("Campaign not found or already accepted");
      }
    } catch (error) {
      throw new Error(`Error deleting campaign: ${(error as Error).message}`);
    }
  }
  async getAllCampaignsWasReject(page: number = 1, limit: number = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [{ path: "organization" }, { path: "state" }],
      };

      const result = await Campaign.paginate({ isdeleted: true }, options);

      return {
        campaigns: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(
        `Error fetching rejected campaigns: ${(error as Error).message}`
      );
    }
  }
  async getFeaturedCampaigns(limit: number = 5) {
    try {
      const campaigns = await Campaign.find({
        isdeleted: false,
        isAccepted: true,
      })
        .sort({
          participated: -1,
          donate: -1,
          dayStart: -1,
        })
        .limit(limit)
        .populate("organization")
        .setOptions({ strictPopulate: false });

      const campaignsWithImages = await Promise.all(
        campaigns.map(async (campaign) => {
          const images = await ImgCampain.find({
            CampID: campaign._id,
            isdeleted: false,
          });

          return {
            ...campaign.toObject(),
            images: images,
            organizationInfo:
              campaign.organization && typeof campaign.organization === "object"
                ? {
                    name:
                      (campaign.organization as any).Inform ||
                      "Tổ chức không xác định",
                    logo:
                      (campaign.organization as any).logo ||
                      "/src/assets/logos/avt.png",
                  }
                : {
                    name: "Tổ chức không xác định",
                    logo: "/src/assets/logos/avt.png",
                  },
          };
        })
      );

      return campaignsWithImages;
    } catch (error) {
      throw new Error(
        `Error fetching featured campaigns: ${(error as Error).message}`
      );
    }
  }
  async getFeaturedActivities(limit: number = 3) {
    try {
      // Lấy các chiến dịch đang diễn ra với thông tin tổ chức và ảnh
      const campaigns = await Campaign.find({
        isdeleted: false,
        isAccepted: true,
      })
        .sort({
          participated: -1,
          donate: -1,
          dayStart: -1,
        })
        .limit(limit)
        .populate({
          path: "organization",
          select: "Inform logo",
        })
        .setOptions({ strictPopulate: false });

      const activitiesWithImages = await Promise.all(
        campaigns.map(async (campaign) => {
          const images = await ImgCampain.find({
            CampID: campaign._id,
            isdeleted: false,
          });

          const campaignObj = campaign.toObject();

          let organizationInfo = {
            name: "Tổ chức không xác định",
            logo: "/src/assets/logos/avt.png",
          };

          if (
            campaignObj.organization &&
            typeof campaignObj.organization === "object"
          ) {
            organizationInfo = {
              name:
                (campaignObj.organization as any).Inform ||
                "Tổ chức không xác định",
              logo:
                (campaignObj.organization as any).logo ||
                "/src/assets/logos/avt.png",
            };
          }

          const result = {
            ...campaignObj,
            images: images,
            organizationInfo,
          };

          return result;
        })
      );

      return activitiesWithImages;
    } catch (error) {
      throw new Error(
        `Error fetching featured activities: ${(error as Error).message}`
      );
    }
  }
}

export default new CampaignService();
