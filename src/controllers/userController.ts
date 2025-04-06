import { NextFunction, Request, Response } from "express";
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

export const changePassword = async function (
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
