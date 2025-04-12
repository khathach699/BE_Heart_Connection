import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { IUser } from "../types/user";
import { Change_Password } from "../services/authService";
import { CreateErrorResponse } from "../utils/responnseHandler";
import { CreateSuccessResponse } from "../utils/responnseHandler";

// Extend Express Request type to include user property
declare module "express" {
  interface Request {
    user?: any;
  }
}

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;
      const newUser = await userService.createUser(userData);
      return CreateSuccessResponse(res, 200, {
        newUser,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 1;
      const result = await userService.getAllUsers(page, limit);
      return CreateSuccessResponse(res, 200, {
        result,
      });
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const user = await userService.getUserById(id);
      return CreateSuccessResponse(res, 200, {
        user,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const user = await userService.updateUser(id, req.body as Partial<IUser>);
      return CreateSuccessResponse(res, 200, {
        user,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deleteUser = await userService.deleteUser(id);
      return CreateSuccessResponse(res, 200, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  changePassword = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { oldPassword, newPassword } = req.body as ChangePasswordRequestBody;
    try {
      let result = await Change_Password(req.user, oldPassword, newPassword);
      return CreateSuccessResponse(res, 200, {
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return CreateErrorResponse(res, 400, error.message);
    }
  };

  async getFeaturedUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const featuredUsers = await userService.getFeaturedUsers(limit);
      return CreateSuccessResponse(res, 200, {
        featuredUsers,
      });
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}
export default new UserController();
