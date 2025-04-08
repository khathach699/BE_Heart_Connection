"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const imgCampainSchema = new Schema({
    imgUrl: {
        type: String,
        required: true,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    CampID: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
}, {
    timestamps: true,
    collection: "imgcampaigns",
});
imgCampainSchema.plugin(mongoose_paginate_v2_1.default);
const ImgCampain = mongoose_1.default.model("ImgCampain", imgCampainSchema);
exports.default = ImgCampain;
//# sourceMappingURL=ImgCampain.js.map