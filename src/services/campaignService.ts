import mongoose from "mongoose";
import Campaign from "../schemas/Campaign";
import { ICampaign, ICampaignDocument } from "../types/Campagin";
import ImgCampain from "../schemas/ImgCampain";
import axios from "axios";
import fs from "fs";
import path from "path";
import ImgCampaign from "../schemas/ImgCampain";
import FormData from "form-data";
import removeAccents from "remove-accents";
import Organization from "../schemas/Organization";
export class CampaignService {
  async approveCampaign(campaignID: string): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findOne({
        _id: campaignID,
        isdeleted: false,
      });
      if (!campaign) throw new Error("Campaign not found");
      if (campaign.isdeleted) throw new Error("Campaign already accepted");
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
      if (campaign.isdeleted)
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

      const campaigns = await Promise.all(
        result.docs.map(async (campaign) => {
          const images = await ImgCampain.find({
            CampID: campaign._id,
            isdeleted: false,
          }).select("imgUrl");

          return {
            ...campaign.toObject(),
            images: images.map((img) => ({ imgUrl: img.imgUrl })),
          };
        })
      );

      return {
        campaigns,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy chiến dịch: ${(error as Error).message}`);
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
    console.log("Fetching rejected campaigns...");
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

  // thach sua
  async getFeaturedCampaigns(limit: number = 7) {
    try {
      console.log("Fetching campaigns...");

      // Truy vấn dữ liệu chiến dịch từ database
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
          select: "info logo", // Chỉ lấy thông tin "info" và "logo"
          match: { isdeleted: false },
        })
        .lean(); // Trả về object JS thông thường

      const campaignsWithImage = await Promise.all(
        campaigns.map(async (campaign) => {
          // Lấy hình ảnh liên quan từ ImgCampain
          const image = await ImgCampain.findOne({
            campaign: campaign._id,
            isdeleted: false,
          }).lean();

          // Trả về dữ liệu chiến dịch bao gồm hình ảnh và thông tin tổ chức
          return {
            _id: campaign._id,
            name: campaign.name,
            participated: campaign.participated,
            img: image?.imgUrl || null, // Nếu không có hình ảnh thì trả null
          };
        })
      );
      return campaignsWithImage;
    } catch (error) {
      console.error(
        "Error fetching featured campaigns:",
        (error as Error).message
      );
      return {
        success: false,
        data: [],
        message: `Error fetching featured campaigns: ${
          (error as Error).message
        }`,
      };
    }
  }

  async getFeaturedActivities(limit: number = 3) {
    try {
      console.log("Fetching featured activities...");

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
          select: "info isdeleted",
          match: { isdeleted: false },
        })
        .lean();

      console.log("Campaigns fetched with populated organization:", campaigns);

      const activitiesWithImages = await Promise.all(
        campaigns.map(async (campaign) => {
          console.log(`Processing campaign: ${campaign._id}`);

          // Lấy 1 hình ảnh đầu tiên của campaign
          const image = await ImgCampain.findOne({
            campaign: campaign._id,
            isdeleted: false,
          }).lean();

          console.log(`Image for campaign ${campaign._id}:`, image);

          return {
            _id: campaign._id,
            name: campaign.name,
            text: campaign.content,

            organization: {
              name:
                (campaign.organization as any)?.info ||
                "Tổ chức không xác định",
            },

            img: image?.imgUrl || null,
          };
        })
      );

      console.log("Final activities with images:", activitiesWithImages);

      return activitiesWithImages;
    } catch (error) {
      console.error(
        "Error fetching featured activities:",
        (error as Error).message
      );
      return {
        success: false,
        data: [],
        message: `Error fetching featured activities: ${
          (error as Error).message
        }`,
      };
    }
  }

  async updateCampaignDonate(
    campaignId: string,
    amount: number
  ): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error("Campaign not found");

      if (campaign.amountOfMoney >= campaign.donate) {
        throw new Error("Campaign has reached its donation goal");
      }
      const currentDonate = Number(campaign.amountOfMoney) || 0;
      const donateAmount = Number(amount) || 0;
      campaign.amountOfMoney = currentDonate + donateAmount;

      await campaign.save();

      return campaign;
    } catch (error) {
      throw new Error(
        `Error updating campaign donate: ${(error as Error).message}`
      );
    }
  }

  async updateCampaignParticipant(
    campaignId: string
  ): Promise<ICampaignDocument> {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const currentParticipant = Number(campaign.numberOfPeople) || 0;
      campaign.numberOfPeople = currentParticipant + 1;

      await campaign.save();

      return campaign;
    } catch (error) {
      throw new Error(
        `Error updating campaign participant: ${(error as Error).message}`
      );
    }
  }

  async getCampaignsByOrgId(orgId: string) {
    try {
      const campaigns = await Campaign.find({
        organization: orgId,
        isdeleted: false,
      }).populate("state");
      return campaigns;
    } catch (error) {
      throw new Error(`Error fetching campaigns: ${(error as Error).message}`);
    }
  }

  private readonly avatarDir: string = path.join(__dirname, "../images");
  private readonly serverCDN: string = "http://localhost:4000/uploadmultiple";
  //Moi cua tao
  async createCampaignWithImages(
    campaignData: ICampaign,
    files: Express.Multer.File[]
  ): Promise<{ campaign: ICampaignDocument; images: string[] }> {
    if (!files || files.length === 0) {
      throw new Error("Chưa chọn file ảnh");
    }
    const requiredFields: (keyof ICampaign)[] = [
      "name",
      "organization",
      "state",
      "Start",
      "NumberOfDay",
    ];
    for (const field of requiredFields) {
      if (!campaignData[field]) {
        throw new Error(`Trường ${field} là bắt buộc`);
      }
    }
    let campaign: ICampaignDocument | null = null;
    try {
      campaign = new Campaign(campaignData);
      await campaign.save();

      const imgCampaigns = [];
      const newForm = new FormData();
      for (const file of files) {
        const imgPath = path.join(this.avatarDir, file.filename);
        newForm.append("images", fs.createReadStream(imgPath));
      }

      let result;
      try {
        result = await axios.post(this.serverCDN, newForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Response from CDN:", result.data);
      } catch (axiosError: any) {
        await Campaign.deleteOne({ _id: campaign._id });
        throw new Error(`Không thể upload ảnh lên CDN: ${axiosError.message}`);
      }

      for (const file of files) {
        const imgPath = path.join(this.avatarDir, file.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      const urls = result.data?.data?.urls;
      if (!Array.isArray(urls) || urls.length !== files.length) {
        throw new Error(
          "Số lượng URL trả về từ CDN không khớp với số file gửi lên"
        );
      }

      for (const url of urls) {
        const imgCampaign = new ImgCampaign({
          CampID: campaign._id,
          imgUrl: url,
        });

        try {
          await imgCampaign.save();
          imgCampaigns.push(imgCampaign);
        } catch (imgError: any) {
          await Campaign.deleteOne({ _id: campaign._id });
          await ImgCampaign.deleteMany({ campaign: campaign._id });
          throw new Error(`Không thể lưu ImgCampaign: ${imgError.message}`);
        }
      }

      if (imgCampaigns.length > 0) {
        campaign.img = imgCampaigns[0].imgUrl;
        await campaign.save();
      }

      return {
        campaign,
        images: imgCampaigns.map((img) => img.imgUrl),
      };
    } catch (error) {
      if (campaign) {
        await Campaign.deleteOne({ _id: campaign._id });
        await ImgCampaign.deleteMany({ campaign: campaign._id });
      }
      throw error;
    }
  }
  cleanupFiles(files: Express.Multer.File[]): void {
    files.forEach((file) => {
      const imgPath = path.join(this.avatarDir, file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });
  }

  async searchCampaign(
    searchQuery: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const allCampaigns = await Campaign.find({ isdeleted: false })
        .populate("organization", "info")
        .populate("state", "name")
        .populate("img")
        .sort({ createdAt: -1 });

      let filteredCampaigns = allCampaigns;

      if (searchQuery && searchQuery.trim() !== "") {
        const normalizedSearch = removeAccents(searchQuery.toLowerCase());
        const tokens = normalizedSearch.split(/\s+/).filter(Boolean);

        filteredCampaigns = allCampaigns.filter((camp) => {
          const nameNormalized = removeAccents(camp.name.toLowerCase());

          return tokens.every((token) => nameNormalized.includes(token));
        });
      }

      const total = filteredCampaigns.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginatedCampaigns = filteredCampaigns.slice(
        offset,
        offset + limit
      );

      return {
        campaigns: paginatedCampaigns,
        total,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Error searching campaigns: ${(error as Error).message}`);
    }
  }
}

export default new CampaignService();
