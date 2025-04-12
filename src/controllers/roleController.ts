import { Request, Response } from "express";
import { IRole } from "../types/role";
import roleService from "../services/roleService";
import { CreateErrorResponse, CreateSuccessResponse } from "../utils/responnseHandler";
export class RoleController {
    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await roleService.getAllRoles();
            CreateSuccessResponse(res, 200, roles);
        } catch (error) {
            CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
    async createRole(req: Request, res: Response) {
        try {
            const role: IRole = req.body;
            const newRole = await roleService.createRole(role);
            CreateSuccessResponse(res, 201, newRole);
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
}
export default new RoleController();