"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { on } = require("./campaign");
const Schema = mongoose_1.default.Schema;
const memberCampaignSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: "State",
        required: true,
        min: 0,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const MemberCampaign = mongoose_1.default.model("MemberCampaign", memberCampaignSchema);
exports.default = MemberCampaign;
//# sourceMappingURL=Member_campaign.js.map