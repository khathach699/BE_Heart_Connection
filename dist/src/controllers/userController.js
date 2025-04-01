"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const User_1 = __importDefault(require("../schemas/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { email, password, fullname } = body;
    console.log(body);
    try {
        const user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }
        const newUser = new User_1.default(body);
        yield newUser.save();
        res.status(200).json({
            message: "Đăng ký thành công",
            data: newUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Lỗi server khi đăng ký",
        });
    }
});
exports.register = register;
//# sourceMappingURL=userController.js.map