import { Router } from "express";
import { check_authentication } from "../utils/check_auth";
import Donate_CampaignController from "../controllers/Donate_campaignController";

const router = Router();
router.get("/", Donate_CampaignController.getAllDonate as unknown as any);
router.post(
  "/detail",
  Donate_CampaignController.getDonateById as unknown as any
);
router.post(
  "/",
  check_authentication,
  Donate_CampaignController.createDonate as unknown as any
);
router.put("/", Donate_CampaignController.updateDonate as unknown as any);
router.delete("/:id", Donate_CampaignController.deleteDonate as unknown as any);
export default router;
