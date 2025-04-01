import { Request, Response } from "express";
import { IRole } from "../types/role";
import roleService from "../services/roleService";

export class RoleController {
    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await roleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async createRole(req: Request, res: Response) {
        try {
            const role: IRole = req.body;
            const newRole = await roleService.createRole(role);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
export default new RoleController();