import { Request, Response } from "express";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";
import { IUserSocial } from "../types/User_social";
import UserSocialService from "../services/User_socialService";


export class UserSocialController {
    async createUserSocial(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const userSocialData = {
                ...req.body,
                user: userId
            };
            const newusersocial = await UserSocialService.createUserSocial(userSocialData);
            return CreateSuccessResponse(res, 201, newusersocial);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllUserSocials(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await UserSocialService.getAllUserSocial(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getUserSocialById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const usersocial = await UserSocialService.getUserSocialById(id);
            return CreateSuccessResponse(res, 200, usersocial);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateUserSocial(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const usersocial = await UserSocialService.updateUserSocial(id, req.body as Partial<IUserSocial>);
            return CreateSuccessResponse(res, 200, { message: "user social updated successfully", usersocial });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteUserSocial(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteUserSocial = await UserSocialService.deleteUserSocial(id);
            return CreateSuccessResponse(res, 200, deleteUserSocial);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new UserSocialController();