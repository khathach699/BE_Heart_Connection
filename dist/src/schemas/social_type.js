"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const socialTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type: String,
        required: true,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const SocialType = mongoose_1.default.model("SocialType", socialTypeSchema);
exports.default = SocialType;
//# sourceMappingURL=social_type.js.map