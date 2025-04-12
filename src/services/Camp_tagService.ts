import { populate } from "dotenv";
import Camp_tag from "../schemas/Camp_tag";
import { ICampaignTag, ICampaignTagDocument } from "../types/Camp_tag";

export class Camp_tagService {
    async getAllCampTag(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: [
                    {
                        path: "campaign",
                    },
                    {
                        path: "tag",
                        select : "name"
                    }
                ]
            };
            const query: any = { isdeleted: false };
            const result = await Camp_tag.paginate(query, options);
            return {
                campTags: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching camp tags: ${(error as Error).message}`);
        }
    }
    async getCampTagById(tag_id: string): Promise<ICampaignTag> {
        try {
            const campTags = await Camp_tag.findOne({ _id: tag_id, isdeleted: false }).populate("campaign").populate({
                path: "tag",
                select: "name"}
            );
            if (!campTags) throw new Error("Camp tags not found");
            return campTags;
        } catch (error) {
            throw new Error(`Error fetching Camp tag: ${(error as Error).message}`);
        }
    }
    async assignCampaignTarget(camptagData: ICampaignTag): Promise<ICampaignTagDocument> {
        try {
            const existingCampTag = await Camp_tag.findOne({
                campaign: camptagData.campaign,
                tag: camptagData.tag,
                isdeleted: false
            });

            if (existingCampTag) {
                throw new Error("This tag is already assigned to this campaign");
            }

            const newcamptag = new Camp_tag(camptagData);
            return await newcamptag.save();
        } catch (error) {
            throw new Error(`Error assigning campaign tag: ${(error as Error).message}`);
        }
    }
    async updateCampTag(id: string, camptagData: Partial<ICampaignTag>): Promise<ICampaignTagDocument> {
        try {
            const campTag = await Camp_tag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                camptagData,
                { new: true }
            );
            if (!campTag) throw new Error("camp tag not found");
            return campTag;
        } catch (error) {
            throw new Error(`Error updating tag: ${(error as Error).message}`);
        }
    }
     async deleteCampTag(id: string): Promise<ICampaignTagDocument> {
        try {
            const campTag = await Camp_tag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!campTag) throw new Error("camp tag not found");
            return campTag;
        } catch (error) {
            throw new Error(`Error deleting camp tag: ${(error as Error).message}`);
        }
    }
}

export default new Camp_tagService();