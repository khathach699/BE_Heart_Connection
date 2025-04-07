import { Request, Response } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import Member_CampaignService from "../services/Member_campaignService";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData: IUser = req.body;
            const newUser = await userService.createUser(userData);
            return CreateSuccessResponse(res, 201, newUser);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await userService.getAllUsers(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.getUserById(id);
            return CreateSuccessResponse(res, 200, user);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.updateUser(id, req.body as Partial<IUser>);
            return CreateSuccessResponse(res, 200, { message: "User updated successfully", user });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deletedUser = await userService.deleteUser(id);
            return CreateSuccessResponse(res, 200, deletedUser);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async getCurrentUser(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const user = await userService.getUserById(userId);
            return CreateSuccessResponse(res, 200, user);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async getUserCampaigns(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const campaignsResult = await Member_CampaignService.getUserCampaigns(userId, page, limit);
            return CreateSuccessResponse(res, 200, campaignsResult);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
}

export default new UserController();