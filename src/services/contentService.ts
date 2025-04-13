import Content from "../schemas/Content";
import { IContent, IContentDocument } from "../types/Content";

export class ContentService {
    async createContent(contentData: IContent): Promise<IContentDocument> {
        try {
            const content = new Content(contentData);
            return await content.save();
        } catch (error) {
            throw new Error(`Error creating content: ${(error as Error).message}`);
        }
    }

    async getAllContent(page: number = 1, limit: number = 10) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 }
            };

            const result = await Content.paginate({ isDeleted: false }, options);
            return {
                contents: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page
            };
        } catch (error) {
            throw new Error(`Error fetching contents: ${(error as Error).message}`);
        }
    }

    async getContentById(id: string): Promise<IContentDocument> {
        try {
            const content = await Content.findOne({ _id: id, isDeleted: false });
            if (!content) throw new Error("Content not found");
            return content;
        } catch (error) {
            throw new Error(`Error fetching content: ${(error as Error).message}`);
        }
    }

    async updateContent(id: string, contentData: Partial<IContent>): Promise<IContentDocument> {
        try {
            const content = await Content.findOneAndUpdate(
                { _id: id, isDeleted: false },
                contentData,
                { new: true }
            );
            if (!content) throw new Error("Content not found");
            return content;
        } catch (error) {
            throw new Error(`Error updating content: ${(error as Error).message}`);
        }
    }

    async deleteContent(id: string): Promise<IContentDocument> {
        try {
            const content = await Content.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true },
                { new: true }
            );
            if (!content) throw new Error("Content not found");
            return content;
        } catch (error) {
            throw new Error(`Error deleting content: ${(error as Error).message}`);
        }
    }
}

export default new ContentService();
