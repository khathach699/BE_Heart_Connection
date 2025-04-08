"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = __importDefault(require("../controllers/campaignController"));
const router = express_1.default.Router();
router.put("/approve/:id", campaignController_1.default.approveCampaign.bind(campaignController_1.default));
router.put("/reject/:id", campaignController_1.default.rejectCampaign.bind(campaignController_1.default));
router.get("/", campaignController_1.default.getAllCampaigns.bind(campaignController_1.default));
router.get("/rejected", campaignController_1.default.getAllCampaignsWasReject.bind(campaignController_1.default));
router.get("/featured", campaignController_1.default.getFeaturedCampaigns.bind(campaignController_1.default));
router.get("/featured-activities", campaignController_1.default.getFeaturedActivities.bind(campaignController_1.default));
router.get("/:id", campaignController_1.default.getCampaignById.bind(campaignController_1.default));
router.delete("/:id", campaignController_1.default.deleteCampaign.bind(campaignController_1.default));
exports.default = router;
//# sourceMappingURL=campaigns.js.map