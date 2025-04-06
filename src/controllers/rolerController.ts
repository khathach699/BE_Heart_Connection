import { Request, Response } from "express";
import { CreateARole } from "../services/roleService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

interface Role {
  name: string;
}

export const CreateRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as Role;
    const role = await CreateARole(name);
    return CreateSuccessResponse(res, 201, role);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Role creation failed";
    return CreateErrorResponse(res, 500, errorMessage);
  }
};
