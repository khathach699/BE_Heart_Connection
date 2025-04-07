import { Request, Response } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import organizationService from "../services/organizationService";
import campaignService from "../services/campaignService";
import postService from "../services/postService";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body);
            const userData: IUser = req.body;
            const newUser = await userService.createUser(userData);
            res.json(newUser);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 1;
            const result = await userService.getAllUsers(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async getUser(req: Request, res: Response) {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getOrganization(req: Request, res: Response) {
        try {
            const User = req.user;
            const org = await organizationService.getOrganizationByUserId(User._id);
            res.status(200).json(org);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getCampaigns(req: Request, res: Response) {
        try {
            const User = req.user;
            if (!User.organization) {
                res.status(404).json({ message: "Organization not found" });
            }else {
                const campaigns = await campaignService.getCampaignsByOrgId(User.organization._id as string);
                res.status(200).json(campaigns);
            }
        }catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getPost(req: Request, res: Response) {
        try {
            const User = req.user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            if (!User.organization) {
                res.status(404).json({ message: "Organization not found" });
            }else {
                const volunteer = await postService.getPostByOrgId(User.organization._id as string, page, limit);
                res.status(200).json(volunteer);
            }
        }catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getUserById(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async updateUser(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const user = await userService.updateUser(id, req.body as Partial<IUser>);
            res.status(200).json({ message: "User updated successfully", user });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteUser = await userService.deleteUser(id);
            res.status(200).json(deleteUser);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }

}
export default new UserController();