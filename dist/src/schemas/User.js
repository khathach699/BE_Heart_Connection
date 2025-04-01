"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Nhớ thêm username và role vào types/user
const userSchema = new Schema({
    // username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    point: { type: Number, default: 0 },
    isdisable: { type: Boolean, default: false },
    // role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isdeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        let salt = bcrypt_1.default.genSaltSync(10);
        let encrypted = bcrypt_1.default.hashSync(this.password, salt);
        this.password = encrypted;
    }
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map