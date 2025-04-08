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
exports.ResetPassword = exports.GetUserByOtp = exports.ForgotPassword = exports.Change_Password = exports.CheckLogin = exports.DeleteAnUser = exports.UpdateAnUser = exports.CreateAnUser = exports.GetUserByToken = exports.GetUserByEmail = exports.GetUserByID = exports.GetAllUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../schemas/User"));
const Role_1 = __importDefault(require("../schemas/Role"));
const constants_1 = require("../utils/constants");
const mailer_1 = require("../utils/mailer");
const GetAllUser = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default.find({}).populate("role");
    });
};
exports.GetAllUser = GetAllUser;
const GetUserByID = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default.findById(id).populate("role");
    });
};
exports.GetUserByID = GetUserByID;
const GetUserByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default
            .findOne({
            email: email,
        })
            .populate("role");
    });
};
exports.GetUserByEmail = GetUserByEmail;
const GetUserByToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default
            .findOne({
            resetPasswordToken: token,
        })
            .populate("role");
    });
};
exports.GetUserByToken = GetUserByToken;
const CreateAnUser = function (email, password, fullname, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let roleObj = yield Role_1.default.findOne({
                name: role,
            });
            console.log(fullname, password, email, role);
            if (roleObj) {
                let newUser = new User_1.default({
                    email: email,
                    password: password,
                    fullname: fullname,
                    role: roleObj._id,
                });
                return yield newUser.save();
            }
            else {
                throw new Error(constants_1.AUTH_ERRORS.ROLE_NOT_FOUND);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.CreateAnUser = CreateAnUser;
const UpdateAnUser = function (id, body) {
    return __awaiter(this, void 0, void 0, function* () {
        let allowField = ["password", "email", "imgURL"];
        let getUser = yield User_1.default.findById(id);
        if (!getUser) {
            throw new Error("User not found");
        }
        for (const key of Object.keys(body)) {
            if (allowField.includes(key)) {
                getUser[key] = body[key];
            }
        }
        return yield getUser.save();
    });
};
exports.UpdateAnUser = UpdateAnUser;
const DeleteAnUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default.findByIdAndUpdate(id, { status: false }, {
            new: true,
        });
    });
};
exports.DeleteAnUser = DeleteAnUser;
const CheckLogin = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User_1.default.findOne({
            email: email,
        });
        if (!user) {
            throw new Error(constants_1.AUTH_ERRORS.EMAIL_AND_PASSWORD_WRONG);
        }
        else {
            if (bcrypt_1.default.compareSync(password, user.password)) {
                return user._id;
            }
            else {
                throw new Error(constants_1.AUTH_ERRORS.EMAIL_AND_PASSWORD_WRONG);
            }
        }
    });
};
exports.CheckLogin = CheckLogin;
const Change_Password = function (user, oldpassword, newpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bcrypt_1.default.compareSync(oldpassword, user.password)) {
            //doit pass
            user.password = newpassword;
            yield user.save();
        }
        else {
            throw new Error(constants_1.AUTH_ERRORS.WRONG_PASSWORD);
        }
    });
};
exports.Change_Password = Change_Password;
const ForgotPassword = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield (0, exports.GetUserByEmail)(email);
        if (!user) {
            throw new Error(constants_1.AUTH_ERRORS.EMAIL_NOT_FOUND);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = Date.now() + 3600000; // 1 hour
        yield user.save();
        yield (0, mailer_1.sendMailForgotPassword)(user.email, otp);
    });
};
exports.ForgotPassword = ForgotPassword;
const GetUserByOtp = function (otp) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User_1.default.findOne({
            otpCode: otp,
        });
    });
};
exports.GetUserByOtp = GetUserByOtp;
const ResetPassword = function (otp, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(otp, newPassword);
            const user = yield (0, exports.GetUserByOtp)(otp);
            if (!user || Date.now() > user.otpExpires) {
                throw new Error(constants_1.AUTH_ERRORS.OTP_EXPIRED);
            }
            user.password = newPassword;
            user.otpCode = null;
            user.otpExpires = null;
            yield user.save();
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.ResetPassword = ResetPassword;
//# sourceMappingURL=authService.js.map