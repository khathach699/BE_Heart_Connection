"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSocialSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    social_type: {
        type: Schema.Types.ObjectId,
        ref: "SocialType",
        required: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
    },
    isdelete: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const UserSocial = mongoose_1.default.model("UserSocial", userSocialSchema);
exports.default = UserSocial;
//# sourceMappingURL=User_social.js.map