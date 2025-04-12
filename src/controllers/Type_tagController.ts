import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { ITypeTag } from "../types/Type_tag";
import TypeTagService from "../services/Type_tagService";

export class TypeTagController {
    async createTypeTag(req: Request, res: Response) {
        try {
            const typeTagData: ITypeTag = req.body;
            const newtypetag = await TypeTagService.createTypeTag(typeTagData);
            return CreateSuccessResponse(res, 201, newtypetag);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllTypeTags(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await TypeTagService.getAllTypeTag(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getTypeTagById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const typeTag = await TypeTagService.getTypeTagById(id);
            return CreateSuccessResponse(res, 200, typeTag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateTypeTag(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const typetag = await TypeTagService.updateTypeTag(id, req.body as Partial<ITypeTag>);
            return CreateSuccessResponse(res, 200, { message: "Type tag updated successfully", typetag });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteTypeTag(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteTypeTag = await TypeTagService.deleteTypeTag(id);
            return CreateSuccessResponse(res, 200, deleteTypeTag);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new TypeTagController();