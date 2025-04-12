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
router.put("/approve/:id", campaignController.approveCampaign.bind(campaignController));
router.put("/reject/:id", campaignController.rejectCampaign.bind(campaignController));
router.get("/", campaignController.getAllCampaigns.bind(campaignController));
router.get("/rejected", campaignController.getAllCampaignsWasReject.bind(campaignController));
router.get("/:id", campaignController.getCampaignById.bind(campaignController));
router.delete("/:id", campaignController.deleteCampaign.bind(campaignController));
router.post("/create", check_authentication,check_authorization(PERMISSIONS.ORGANIZATION) , upload.array("images", 5), campaignController.createCampaign.bind(campaignController)
);

export default router;