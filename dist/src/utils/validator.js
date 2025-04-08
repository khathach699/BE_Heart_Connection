"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidator = exports.LoginValidator = exports.SignupValidator = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const { CreateErrorResponse } = require("./responnseHandler");
const { VALIDATOR_ERRORS } = require("./constants");
let util = require("util");
const express_validator_2 = require("express-validator");
let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    },
    username: {
        minLength: 3,
        maxLength: 20,
        regex: /^[a-zA-Z0-9]+$/,
    },
};
const validate = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((err) => err.msg)
            .join(", ");
        CreateErrorResponse(res, 400, errorMessages);
    }
    else {
        next();
    }
};
exports.validate = validate;
exports.SignupValidator = [
    (0, express_validator_2.body)("email").isEmail().withMessage(VALIDATOR_ERRORS.EMAIL),
    (0, express_validator_2.body)("password")
        .isStrongPassword(options.password)
        .withMessage(util.format(VALIDATOR_ERRORS.PASSWORD, options.password.minLength, options.password.minLowercase, options.password.minUppercase, options.password.minNumbers, options.password.minSymbols)),
    (0, express_validator_2.body)("fullname")
        .isLength({ min: 3 })
        .withMessage(util.format(VALIDATOR_ERRORS.FULLNAME, options.username.minLength)),
];
exports.LoginValidator = [
    (0, express_validator_2.body)("email").isEmail().withMessage(VALIDATOR_ERRORS.EMAIL),
    (0, express_validator_2.body)("password").isLength({ min: 8 }).withMessage(VALIDATOR_ERRORS.PASSWORD),
];
exports.ChangePasswordValidator = [
    (0, express_validator_2.body)("oldPassword")
        .isLength({ min: 8 })
        .withMessage(VALIDATOR_ERRORS.PASSWORD),
    (0, express_validator_2.body)("newPassword")
        .isLength({ min: 8 })
        .withMessage(VALIDATOR_ERRORS.PASSWORD),
];
exports.default = {
    validate: exports.validate,
    SignupValidator: exports.SignupValidator,
    LoginValidator: exports.LoginValidator,
    ChangePasswordValidator: exports.ChangePasswordValidator,
};
//# sourceMappingURL=validator.js.map