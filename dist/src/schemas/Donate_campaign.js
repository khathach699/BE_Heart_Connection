"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const donateCampaignSchema = new Schema({
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
    money: {
        type: Number,
        required: true,
        min: 0,
    },
    content: {
        type: String,
        default: "",
    },
    time: {
        type: Date,
        default: Date.now,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const DonateCampaign = mongoose_1.default.model("DonateCampaign", donateCampaignSchema);
exports.default = DonateCampaign;
//# sourceMappingURL=Donate_campaign.js.map