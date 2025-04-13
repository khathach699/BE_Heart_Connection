import express from "express";
import campaignController from "../controllers/campaignController";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { check_authentication, check_authorization } from "../utils/check_auth";
import { PERMISSIONS } from "../utils/constants";
const avatarDir: string = path.join(__dirname, "../images");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match("image")) {
      cb(new Error("Chỉ nhận file ảnh!"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
const router = express.Router();
router.put(
  "/approve/:id",
  campaignController.approveCampaign as unknown as any
);
router.put("/reject/:id", campaignController.rejectCampaign as unknown as any);
router.get("/", campaignController.getAllCampaigns as unknown as any);
router.get(
  "/rejected",
  campaignController.getAllCampaignsWasReject as unknown as any
);
router.get(
  "/featured",
  campaignController.getFeaturedCampaigns as unknown as any
);
router.get(
  "/featured-activities",
  campaignController.getFeaturedActivities as unknown as any
);
router.get("/:id", campaignController.getCampaignById as unknown as any);
router.delete("/:id", campaignController.deleteCampaign as unknown as any);

export default router;
