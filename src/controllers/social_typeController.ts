import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { ISocialType } from "../types/social_type";
import social_typeService from "../services/social_typeService";

export class SocialTypeController {
    async createSocialType(req: Request, res: Response) {
        try {
            const socialTypeData: ISocialType = req.body;
            const newSocialType = await social_typeService.createSocialType(socialTypeData);
            return CreateSuccessResponse(res, 201, newSocialType);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllSocialTypes(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await social_typeService.getAllSocialType(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getSocialTypeById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const socialType = await social_typeService.getSocialTypeById(id);
            return CreateSuccessResponse(res, 200, socialType);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateSocialType(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const socialType = await social_typeService.updateSocialType(id, req.body as Partial<ISocialType>);
            return CreateSuccessResponse(res, 200, { message: "Social type updated successfully", socialType });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteSocialType(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteSocialType = await social_typeService.deleteSocialType(id);
            return CreateSuccessResponse(res, 200, deleteSocialType);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new SocialTypeController();