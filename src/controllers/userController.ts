import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/userService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

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
    const userData = await registerUser(email, password, fullname);
    return CreateSuccessResponse(res, 201, {
      message: "Registration successful",
      data: userData,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error during registration";
    return CreateErrorResponse(res, 400, errorMessage);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequestBody;
    const userData = await loginUser(email, password);
    return CreateSuccessResponse(res, 200, {
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error during login";
    return CreateErrorResponse(res, 400, errorMessage);
  }
};

export default { register, login };
