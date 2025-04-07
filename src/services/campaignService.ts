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
      console.log("getFeaturedActivities called with limit:", limit);

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
        .populate("organization")
        .setOptions({ strictPopulate: false });

      console.log("Số lượng campaigns tìm thấy:", campaigns.length);

      if (campaigns.length === 0) {
        console.log("Không tìm thấy chiến dịch nào thỏa mãn điều kiện");
        return [];
      }

      // Debug organization data
      campaigns.forEach((campaign, index) => {
        console.log(
          `Campaign ${index} organization:`,
          JSON.stringify(campaign.organization)
        );
      });

      // Thêm hình ảnh cho mỗi hoạt động
      const activitiesWithImages = await Promise.all(
        campaigns.map(async (campaign) => {
          try {
            const images = await ImgCampain.find({
              CampID: campaign._id,
              isdeleted: false,
            });

            console.log(
              `Campaign ${campaign._id}: Tìm thấy ${images.length} hình ảnh`
            );

            // Convert to plain object first
            const campaignObj = campaign.toObject();
            console.log("Campaign object:", JSON.stringify(campaignObj));

            // Extract organization info correctly
            let organizationInfo = {
              name: "Tổ chức không xác định",
              logo: "/src/assets/logos/avt.png",
            };

            if (campaignObj.organization) {
              console.log(
                "Found organization:",
                JSON.stringify(campaignObj.organization)
              );
              organizationInfo = {
                name:
                  (campaignObj.organization as any).Inform ||
                  "Tổ chức không xác định",
                logo:
                  (campaignObj.organization as any).logo ||
                  "/src/assets/logos/avt.png",
              };
              console.log("Extracted organization info:", organizationInfo);
            }

            return {
              ...campaignObj,
              images: images,
              organizationInfo,
            };
          } catch (error) {
            console.error(`Lỗi khi xử lý campaign ${campaign._id}:`, error);
            return {
              ...campaign.toObject(),
              images: [],
              organizationInfo: {
                name: "Tổ chức không xác định",
                logo: "/src/assets/logos/avt.png",
              },
            };
          }
        })
      );

      console.log("Final featured activities:", activitiesWithImages.length);
      return activitiesWithImages;
    } catch (error) {
      console.error("Error in getFeaturedActivities:", error);
      throw new Error(
        `Error fetching featured activities: ${(error as Error).message}`
      );
    }
  }
}

export default new CampaignService();
