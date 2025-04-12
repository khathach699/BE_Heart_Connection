import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { ICampaignTag, ICampaignTagDocument } from "../types/Camp_tag";
import CampTagService from "../services/Camp_tagService";

export class CampTagController {
    async createCampTag(req: Request, res: Response) {
        try {
            const camptagData: ICampaignTag = req.body;
            const newcamptag = await CampTagService.assignCampaignTarget(camptagData);
            return CreateSuccessResponse(res, 201, newcamptag);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllCampTags(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await CampTagService.getAllCampTag(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getCampTagById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const camptag = (await CampTagService.getCampTagById(id));
            return CreateSuccessResponse(res, 200, camptag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateCampTag(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const tag = await CampTagService.updateCampTag(id, req.body as Partial<ICampaignTag>);
            return CreateSuccessResponse(res, 200, { message: "Camp tag updated successfully", tag });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteCampTag(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteCampTag = await CampTagService.deleteCampTag(id);
            return CreateSuccessResponse(res, 200, deleteCampTag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new CampTagController();