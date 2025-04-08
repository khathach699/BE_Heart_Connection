"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaignService_1 = __importDefault(require("../services/campaignService"));
class CampaignController {
    approveCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaignId = req.params.id;
                if (!campaignId) {
                    throw res.status(400).json({ message: "Campaign ID is required" });
                }
                const campaign = yield campaignService_1.default.approveCampaign(campaignId);
                res.status(200).json({ message: "Campaign approved", campaign });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    rejectCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaignId = req.params.id;
                if (!campaignId) {
                    throw res.status(400).json({ message: "Campaign ID is required" });
                }
                const campaign = yield campaignService_1.default.rejectCampaign(campaignId);
                res.status(200).json({ message: "Campaign request rejected", campaign });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAllCampaigns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const isAccepted = req.query.isAccepted === "true"
                    ? true
                    : req.query.isAccepted === "false"
                        ? false
                        : undefined;
                const result = yield campaignService_1.default.getAllCampaigns(page, limit, isAccepted);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getCampaignById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaignId = req.params.id;
                if (!campaignId) {
                    throw res.status(400).json({ message: "Campaign ID is required" });
                }
                const campaign = yield campaignService_1.default.getCampaignById(campaignId);
                res.status(200).json(campaign);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    deleteCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaignId = req.params.id;
                if (!campaignId) {
                    throw res.status(400).json({ message: "Campaign ID is required" });
                }
                const campaign = yield campaignService_1.default.deleteCampaign(campaignId);
                res.status(200).json({ message: "Campaign deleted", campaign });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    getAllCampaignsWasReject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield campaignService_1.default.getAllCampaignsWasReject(page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getFeaturedCampaigns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 5;
                const featuredCampaigns = yield campaignService_1.default.getFeaturedCampaigns(limit);
                res.status(200).json({
                    success: true,
                    data: {
                        featuredCampaigns,
                    },
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    getFeaturedActivities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 3;
                console.log("getFeaturedActivities controller called with limit:", limit);
                const featuredActivities = yield campaignService_1.default.getFeaturedActivities(limit);
                console.log("getFeaturedActivities controller received result with length:", featuredActivities.length);
                res.status(200).json({
                    success: true,
                    data: {
                        featuredActivities,
                    },
                });
            }
            catch (error) {
                console.error("getFeaturedActivities controller error:", error);
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.CampaignController = CampaignController;
exports.default = new CampaignController();
//# sourceMappingURL=campaignController.js.map