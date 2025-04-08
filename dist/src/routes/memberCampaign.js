"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memberCampaignController_1 = __importDefault(require("../controllers/memberCampaignController"));
const router = express_1.default.Router();
// Get campaigns for a specific user
router.post("/user", memberCampaignController_1.default.getUserCampaigns);
exports.default = router;
//# sourceMappingURL=memberCampaign.js.map