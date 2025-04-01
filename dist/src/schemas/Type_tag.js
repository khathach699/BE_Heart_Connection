"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const typeTagSchema = new Schema({
    name: {
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
const TypeTag = mongoose_1.default.model("TypeTag", typeTagSchema);
exports.default = TypeTag;
//# sourceMappingURL=Type_tag.js.map