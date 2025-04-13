import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { IContent } from "../types/Content";
import contentService from "../services/contentService";

export class ContentController {
    async createContent(req: Request, res: Response) {
        try {
            const contentData: IContent = req.body;
            const newContent = await contentService.createContent(contentData);
            return CreateSuccessResponse(res, 201, newContent);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllContent(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await contentService.getAllContent(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getContentById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const content = await contentService.getContentById(id);
            return CreateSuccessResponse(res, 200, content);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateContent(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const content = await contentService.updateContent(id, req.body as Partial<IContent>);
            return CreateSuccessResponse(res, 200, {
                message: "Content updated successfully",
                content
            });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteContent(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const content = await contentService.deleteContent(id);
            return CreateSuccessResponse(res, 200, {
                message: "Content deleted successfully",
                content
            });
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}

export default new ContentController();
