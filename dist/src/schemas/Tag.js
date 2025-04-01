"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    typeTag: {
        type: Schema.Types.ObjectId,
        ref: "TypeTag",
        required: true,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Tag = mongoose.model("Tag", tagSchema);
exports.default = Tag;
//# sourceMappingURL=Tag.js.map