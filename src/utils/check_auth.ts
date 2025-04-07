import jwt from "jsonwebtoken";
import { GetUserByID } from "../services/authService";
import { AUTH_ERRORS, PERMISSIONS } from "./constants";
import { Request, Response, NextFunction } from "express";

// check authentication
export const check_authentication = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;
  if (!req.headers || !req.headers.authorization) {
    token = req.signedCookies.token;
  } else {
    let authorization = req.headers.authorization;
    if (!authorization.startsWith("Bearer ")) {
      next(new Error(AUTH_ERRORS.UNAUTHORIZED));
    }
    token = authorization.split(" ")[1];
  }
  if (!token) {
    next(new Error(AUTH_ERRORS.AUTHENTICATION_REQUIRED));
  } else {
    if (!process.env.JWT_SECRET) {
      next(new Error(AUTH_ERRORS.JWT_NOT_DEFINED));
    }
    let result = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as unknown as {
      exp: number;
      id: string;
    };
    if (result.exp > Date.now()) {
      let user = await GetUserByID(result.id);
      (req as any).user = user;
      next();
    } else {
      next(new Error(AUTH_ERRORS.INVALID_TOKEN));
    }
  }
};

// check authorization
export const check_authorization = function (requireRole: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let userRole = (req as any).user.role.name;
    if (!requireRole.includes(userRole)) {
      next(new Error(AUTH_ERRORS.UNAUTHORIZED));
    } else {
      next();
    }
  };
};

export default { check_authentication, check_authorization };
