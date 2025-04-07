import { Request, Response } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import Member_CampaignService from "../services/Member_CampaignService";

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
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await userService.getAllUsers(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
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

    async getCurrentUser(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }

    async getUserCampaigns(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const campaignsResult = await Member_CampaignService.getUserCampaigns(userId, page, limit);
            res.status(200).json(campaignsResult);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
export default new UserController();