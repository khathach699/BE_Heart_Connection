"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const campaignSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: "State",
        required: true,
    },
    content: {
        type: String,
    },
    numberOfPeople: {
        type: Number,
        default: 0,
    },
    amountOfMoney: {
        type: Number,
        default: 0,
    },
    donate: {
        type: Number,
        default: 0,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    dayStart: {
        type: Date,
        required: true,
    },
    numberOfDay: {
        type: Number,
        required: true,
    },
    participated: {
        type: Number,
        default: 0,
    },
    img: {
        type: String,
    },
    statusId: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
const Campaign = mongoose_1.default.model("Campaign", campaignSchema);
exports.default = Campaign;
//# sourceMappingURL=Campaign.js.map