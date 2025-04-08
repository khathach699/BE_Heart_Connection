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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const responnseHandler_1 = require("../utils/responnseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullname } = req.body;
        const role = "user";
        const userData = yield (0, authService_1.CreateAnUser)(email, password, fullname, role);
        return (0, responnseHandler_1.CreateSuccessResponse)(res, 201, userData);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error during registration";
        return (0, responnseHandler_1.CreateErrorResponse)(res, 400, errorMessage);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userId = yield (0, authService_1.CheckLogin)(email, password);
        let exp = new Date(Date.now() + 60 * 60 * 1000).getTime();
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret is not defined");
        }
        let token = jsonwebtoken_1.default.sign({ id: userId, exp: exp }, process.env.JWT_SECRET);
        (0, responnseHandler_1.CreateCookieResponse)(res, "token", token, exp);
        return (0, responnseHandler_1.CreateSuccessResponse)(res, 200, { token });
    }
    catch (error) {
        return (0, responnseHandler_1.CreateErrorResponse)(res, 400, error.message);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    return (0, responnseHandler_1.CreateSuccessResponse)(res, 200, { message: "Logout successful" });
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, authService_1.ForgotPassword)(email);
        return (0, responnseHandler_1.CreateSuccessResponse)(res, 200, { message: "Email sent" });
    }
    catch (error) {
        return (0, responnseHandler_1.CreateErrorResponse)(res, 400, error.message);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, newPassword } = req.body;
        yield (0, authService_1.ResetPassword)(otp, newPassword);
        return (0, responnseHandler_1.CreateSuccessResponse)(res, 200, { message: "Password reset" });
    }
    catch (error) {
        return (0, responnseHandler_1.CreateErrorResponse)(res, 400, error.message);
    }
});
exports.resetPassword = resetPassword;
exports.default = { register: exports.register, login: exports.login, forgotPassword: exports.forgotPassword, resetPassword: exports.resetPassword };
//# sourceMappingURL=authController.js.map