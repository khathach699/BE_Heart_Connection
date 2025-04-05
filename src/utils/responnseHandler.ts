import { Response } from "express";

export const CreateSuccessResponse = function (
  res: Response,
  status: number,
  data: Record<string, any>
) {
  return res.status(status).send({ success: true, data: data });
};

export const CreateErrorResponse = function (
  res: Response,
  status: number,
  message: string
) {
  return res.status(status).send({ success: false, message });
};

export const CreateCookieResponse = function (
  res: Response,
  key: string,
  value: string,
  exp: number
) {
  res.cookie(key, value, {
    httpOnly: true,

    expires: new Date(exp),
    signed: true,
  });
};

export default {
  CreateSuccessResponse,
  CreateErrorResponse,
  CreateCookieResponse,
};
