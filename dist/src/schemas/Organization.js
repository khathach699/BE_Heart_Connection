"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const organizationSchema = new Schema({
    info: {
        type: String,
    },
    certificate: {
        type: String,
    },
    bankName: {
        type: String,
    },
    bankNumber: {
        type: String,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Organization = mongoose_1.default.model("Organization", organizationSchema);
exports.default = Organization;
//# sourceMappingURL=Organization.js.map