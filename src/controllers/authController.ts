import { Request, Response } from "express";
import {
  CreateAnUser,
  CheckLogin,
  ForgotPassword,
  ResetPassword,
} from "../services/authService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
  CreateCookieResponse,
} from "../utils/responnseHandler";
import jwt from "jsonwebtoken";

interface RegisterRequestBody {
  email: string;
  password: string;
  fullname: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullname } = req.body as RegisterRequestBody;
    const role = "user";
    const userData = await CreateAnUser(email, password, fullname, role);

    return CreateSuccessResponse(res, 201, userData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error during registration";
    return CreateErrorResponse(res, 400, errorMessage);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequestBody;
    const userId = await CheckLogin(email, password);
    let exp = new Date(Date.now() + 60 * 60 * 1000).getTime();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    let token = jwt.sign({ id: userId, exp: exp }, process.env.JWT_SECRET);
    CreateCookieResponse(res, "token", token, exp);
    return CreateSuccessResponse(res, 200, { token });
  } catch (error: any) {
    return CreateErrorResponse(res, 400, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return CreateSuccessResponse(res, 200, { message: "Logout successful" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    await ForgotPassword(email);
    return CreateSuccessResponse(res, 200, { message: "Email sent" });
  } catch (error: any) {
    return CreateErrorResponse(res, 400, error.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { otp, newPassword } = req.body as {
      otp: string;
      newPassword: string;
    };
    await ResetPassword(otp, newPassword);
    return CreateSuccessResponse(res, 200, { message: "Password reset" });
  } catch (error: any) {
    return CreateErrorResponse(res, 400, error.message);
  }
};

export default { register, login, forgotPassword, resetPassword };
