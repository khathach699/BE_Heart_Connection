"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCookieResponse = exports.CreateErrorResponse = exports.CreateSuccessResponse = void 0;
const CreateSuccessResponse = function (res, status, data) {
    return res.status(status).send({ success: true, data: data });
};
exports.CreateSuccessResponse = CreateSuccessResponse;
const CreateErrorResponse = function (res, status, message) {
    return res.status(status).send({ success: false, message });
};
exports.CreateErrorResponse = CreateErrorResponse;
const CreateCookieResponse = function (res, key, value, exp) {
    res.cookie(key, value, {
        httpOnly: true,
        expires: new Date(exp),
        signed: true,
    });
};
exports.CreateCookieResponse = CreateCookieResponse;
exports.default = {
    CreateSuccessResponse: exports.CreateSuccessResponse,
    CreateErrorResponse: exports.CreateErrorResponse,
    CreateCookieResponse: exports.CreateCookieResponse,
};
//# sourceMappingURL=responnseHandler.js.map