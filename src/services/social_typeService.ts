import { populate } from "dotenv";
import SocialType from "../schemas/social_type";
import { ISocialType, ISocialTypeDocument } from "../types/social_type";

export class SocialTypeService {
    async getAllSocialType(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
            };
            const query: any = { isdeleted: false };
            const result = await SocialType.paginate(query, options);
            return {
                socialType: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching social type: ${(error as Error).message}`);
        }
    }
    async getSocialTypeById(socialtype_id: string): Promise<ISocialTypeDocument> {
        try {
            const socialtype = await SocialType.findOne({ _id: socialtype_id, isdeleted: false })
            if (!socialtype) throw new Error("social type not found");
            return socialtype;
        } catch (error) {
            throw new Error(`Error fetching social type: ${(error as Error).message}`);
        }
    }
    async createSocialType(socialTypeData: ISocialType): Promise<ISocialTypeDocument> {
        try {
            const newSocialType = new SocialType(socialTypeData);
            const existingSocialType = await SocialType.findOne({ name: socialTypeData.name });
            if (existingSocialType) throw new Error("Social type already exists");
            return await newSocialType.save();
        } catch (error) {
            throw new Error(`Error creating social type: ${(error as Error).message}`);
        }
    }
    async updateSocialType(id: string, socialTypeData: Partial<ISocialType>): Promise<ISocialTypeDocument> {
        try {
            const socialType = await SocialType.findOneAndUpdate(
                { _id: id, isdeleted: false },
                socialTypeData,
                { new: true }
            );
            if (!socialType) throw new Error("Social type not found");
            return socialType;
        } catch (error) {
            throw new Error(`Error updating social type: ${(error as Error).message}`);
        }
    }
     async deleteSocialType(id: string): Promise<ISocialType> {
        try {
            const socialType = await SocialType.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!socialType) throw new Error("Social type not found");
            return socialType;
        } catch (error) {
            throw new Error(`Error deleting social type: ${(error as Error).message}`);
        }
    }
}

export default new SocialTypeService();