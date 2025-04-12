import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { ITag } from "../types/Tag";
import TagService from "../services/TagService";

export class TagController {
    async createTag(req: Request, res: Response) {
        try {
            const tagData: ITag = req.body;
            const newtag = await TagService.createTag(tagData);
            return CreateSuccessResponse(res, 201, newtag);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllTags(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await TagService.getAllTag(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getTagById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const tag = (await TagService.getTagById(id));
            return CreateSuccessResponse(res, 200, tag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateTag(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const tag = await TagService.updateTag(id, req.body as Partial<ITag>);
            return CreateSuccessResponse(res, 200, { message: "Tag updated successfully", tag });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteTag(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteTag = await TagService.deleteTag(id);
            return CreateSuccessResponse(res, 200, deleteTag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new TagController();