"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const campTagSchema = new Schema({
    campaign: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    tag: {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    id: false,
});
const CampTag = mongoose_1.default.model("CampTag", campTagSchema);
exports.default = CampTag;
//# sourceMappingURL=Camp_tag.js.map