import mongoose from "mongoose";
import Campaign from "../schemas/Campaign";
import { ICampaign, ICampaignDocument } from "../types/Campagin";
import axios from "axios";
import fs from "fs";
import path from "path";
import ImgCampaign from "../schemas/Img_campaign";
import FormData from 'form-data';
export class CampaignService {

    async approveCampaign(campaignID: string): Promise<ICampaignDocument> {
        try {
            const campaign = await Campaign.findOne({ _id: campaignID, isdeleted: false });
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
            if (campaign.isAccepted) throw new Error("Campaign already accepted, cannot be rejected");

            campaign.isdeleted = true;
            await campaign.save();

            return campaign;
        } catch (error) {
            throw new Error(`Error rejecting campaign: ${(error as Error).message}`);
        }
    }
    async getAllCampaigns(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: [
                    { path: "organization" },
                    { path: "state" }
                ],
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
    async getCampaignsByOrgId(orgId: string) {
        try {
            const campaigns = await Campaign.find({ organization: orgId, isdeleted: false }).populate("state");
            return campaigns;
        } catch (error) {
            throw new Error(`Error fetching campaigns: ${(error as Error).message}`);
        }
    }
    async getCampaignById(campaignId: string): Promise<ICampaignDocument> {
        try {
            const campaign = await Campaign.findOne({ _id: campaignId, isdeleted: false }).populate("organization").populate("state");
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
                populate: [
                    { path: "organization" },
                    { path: "state" }
                ],
            };

            const result = await Campaign.paginate({ isdeleted: true }, options);

            return {
                campaigns: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching campaign: ${(error as Error).message}`);
        }
    }

    private readonly avatarDir: string = path.join(__dirname, "../images");
    private readonly serverCDN: string = "http://localhost:4000/upload";

    async createCampaignWithImages(campaignData: ICampaign, files: Express.Multer.File[]): Promise<{ campaign: ICampaignDocument; images: string[] }> {
        if (!files || files.length === 0) {
            throw new Error("Chưa chọn file ảnh");
        }
        console.log("check files:", files);
        const requiredFields: (keyof ICampaign)[] = [
            "name",
            "organization",
            "state",
            "dayStart",
            "numberOfDay",
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
            console.log("Sending files to CDN with field 'images':", files.map(f => f.filename));

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

            const urls = result.data.urls;
            if (!urls || urls.length !== files.length) {
                throw new Error("Số lượng URL trả về từ CDN không khớp với số file gửi lên");
            }

            for (const url of urls) {
                const imgCampaign = new ImgCampaign({
                    campaign: campaign._id,
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
                images: imgCampaigns.map(img => img.imgUrl),
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
        files.forEach(file => {
            const imgPath = path.join(this.avatarDir, file.filename);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });
    }
}

export default new CampaignService();