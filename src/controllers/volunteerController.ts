import { Request, Response } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import organizationService from "../services/organizationService";
import campaignService from "../services/campaignService";
import postService from "../services/postService";
import { CreateErrorResponse, CreateSuccessResponse } from "../utils/responnseHandler";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body);
            const userData: IUser = req.body;
            const newUser = await userService.createUser(userData);
            CreateSuccessResponse(res, 201, newUser);
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
    async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 1;
            const result = await userService.getAllUsers(page, limit);;
            CreateSuccessResponse(res,200, result);
        } catch (error) {
            CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
    async getUser(req: Request, res: Response) {
        try {
            CreateSuccessResponse(res, 200, req.user);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async getOrganization(req: Request, res: Response) {
        try {
            const User = req.user;
            const org = await organizationService.getOrganizationByUserId(User._id);
            CreateSuccessResponse(res, 200, org || {});
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async getCampaigns(req: Request, res: Response) {
        try {
            const User = req.user;
            if (!User.organization) {
                CreateErrorResponse(res, 404, "Organization not found");
            }else {
                const campaigns = await campaignService.getCampaignsByOrgId(User.organization._id as string);
                CreateSuccessResponse(res, 200, campaigns);
            }
        }catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async getPost(req: Request, res: Response) {
        try {
            const User = req.user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            if (!User.organization) {
                CreateErrorResponse(res, 404, "Organization not found");
            }else {
                const volunteer = await postService.getPostByOrgId(User.organization._id as string, page, limit);
                CreateSuccessResponse(res, 200, volunteer);
            }
        }catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async getUserById(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.getUserById(id);
            CreateSuccessResponse(res, 200, user);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async updateUser(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.updateUser(id, req.body as Partial<IUser>);
            CreateSuccessResponse(res, 200, user);
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteUser = await userService.deleteUser(id);
            CreateSuccessResponse(res, 200, deleteUser);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

}
export default new UserController();