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
exports.check_authorization = exports.check_authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const constants_1 = require("./constants");
// check authentication
const check_authentication = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (!req.headers || !req.headers.authorization) {
            token = req.signedCookies.token;
        }
        else {
            let authorization = req.headers.authorization;
            if (!authorization.startsWith("Bearer ")) {
                next(new Error(constants_1.AUTH_ERRORS.UNAUTHORIZED));
            }
            token = authorization.split(" ")[1];
        }
        if (!token) {
            next(new Error(constants_1.AUTH_ERRORS.AUTHENTICATION_REQUIRED));
        }
        else {
            if (!process.env.JWT_SECRET) {
                next(new Error(constants_1.AUTH_ERRORS.JWT_NOT_DEFINED));
            }
            let result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (result.exp > Date.now()) {
                let user = yield (0, authService_1.GetUserByID)(result.id);
                req.user = user;
                next();
            }
            else {
                next(new Error(constants_1.AUTH_ERRORS.INVALID_TOKEN));
            }
        }
    });
};
exports.check_authentication = check_authentication;
// check authorization
const check_authorization = function (requireRole) {
    return __awaiter(this, void 0, void 0, function* () {
        return (req, res, next) => {
            let userRole = req.user.role.name;
            if (!requireRole.includes(userRole)) {
                next(new Error(constants_1.AUTH_ERRORS.UNAUTHORIZED));
            }
            else {
                next();
            }
        };
    });
};
exports.check_authorization = check_authorization;
exports.default = { check_authentication: exports.check_authentication, check_authorization: exports.check_authorization };
//# sourceMappingURL=check_auth.js.map