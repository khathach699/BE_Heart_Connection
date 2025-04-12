import { populate } from "dotenv";
import { ITag, ITagDocument } from "../types/Tag";
import Tag from "../schemas/Tag";

export class TagService {
    async getAllTag(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: {
                    path: "typeTag",
                    select : "name",
                },
            };
            const query: any = { isdeleted: false };
            const result = await Tag.paginate(query, options);
            return {
                tags: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching tags: ${(error as Error).message}`);
        }
    }
    async getTagById(tag_id: string): Promise<ITagDocument> {
        try {
            const tag = await Tag.findOne({ _id: tag_id, isdeleted: false })
                .populate({
                    path: "typeTag",
                    select: "name"
                });
            if (!tag) throw new Error("Tag not found");
            return tag;
        } catch (error) {
            throw new Error(`Error fetching tag: ${(error as Error).message}`);
        }
    }
    async createTag(tagData: ITag): Promise<ITagDocument> {
        try {
            const newtag = new Tag(tagData);
            const existingtag = await Tag.findOne({ name: tagData.name });
            if (existingtag) throw new Error("Tag already exists");
            return await newtag.save();
        } catch (error) {
            throw new Error(`Error creating tag: ${(error as Error).message}`);
        }
    }
    async updateTag(id: string, tagData: Partial<ITag>): Promise<ITagDocument> {
        try {
            const tag = await Tag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                tagData,
                { new: true }
            );
            if (!tag) throw new Error("tag not found");
            return tag;
        } catch (error) {
            throw new Error(`Error updating tag: ${(error as Error).message}`);
        }
    }
     async deleteTag(id: string): Promise<ITagDocument> {
        try {
            const tag = await Tag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!tag) throw new Error("tag not found");
            return tag;
        } catch (error) {
            throw new Error(`Error deleting tag: ${(error as Error).message}`);
        }
    }
}

export default new TagService();