"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const memberCampaignSchema = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    CampID: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    StatusID: {
        type: Number,
        required: true,
    },
    IsDelete: {
        type: Number,
        default: 0,
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    collection: "membercampaigns",
});
memberCampaignSchema.plugin(mongoose_paginate_v2_1.default);
const MemberCampaign = mongoose_1.default.model("MemberCampaign", memberCampaignSchema);
exports.default = MemberCampaign;
//# sourceMappingURL=MemberCampaign.js.map