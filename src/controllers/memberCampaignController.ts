import { Request, Response, NextFunction } from "express";
import memberCampaignService from "../services/memberCampaignService";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export class MemberCampaignController {
  getUserCampaigns = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let userId = req.body.userId;

      // Thử lấy ID từ token JWT nếu không có trong body
      if (!userId && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
          ) as any;
          if (decoded && decoded.id) {
            userId = decoded.id;
            console.log("Using ID from JWT token:", userId);
          }
        } catch (err) {
          console.error("Error decoding JWT:", err);
        }
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      console.log("User ID from request:", userId);

      // Chuyển đổi userId thành ObjectId nếu là chuỗi
      const userObjectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      const memberCampaigns = await memberCampaignService.getUserCampaigns(
        userObjectId
      );

      return res.status(200).json({
        success: true,
        data: {
          memberCampaigns,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new MemberCampaignController();
