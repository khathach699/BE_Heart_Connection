import { validationResult } from "express-validator";
const { CreateErrorResponse } = require("./responnseHandler");
const { VALIDATOR_ERRORS } = require("./constants");
let util = require("util");
import { body } from "express-validator";

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

export const validate = (req: any, res: any, next: any) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    CreateErrorResponse(res, 400, errorMessages);
  } else {
    next();
  }
};

export const SignupValidator = [
  body("email").isEmail().withMessage(VALIDATOR_ERRORS.EMAIL),
  body("password")
    .isStrongPassword(options.password)
    .withMessage(
      util.format(
        VALIDATOR_ERRORS.PASSWORD,
        options.password.minLength,
        options.password.minLowercase,
        options.password.minUppercase,
        options.password.minNumbers,
        options.password.minSymbols
      )
    ),
  body("fullname")
    .isLength({ min: 3 })
    .withMessage(
      util.format(VALIDATOR_ERRORS.FULLNAME, options.username.minLength)
    ),
];

export const LoginValidator = [
  body("email").isEmail().withMessage(VALIDATOR_ERRORS.EMAIL),
  //body("password").isLength({ min: 8 }).withMessage(VALIDATOR_ERRORS.PASSWORD),
];

export const ChangePasswordValidator = [
  body("oldPassword")
    .isLength({ min: 8 })
    .withMessage(VALIDATOR_ERRORS.PASSWORD),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage(VALIDATOR_ERRORS.PASSWORD),
];

export default {
  validate,
  SignupValidator,
  LoginValidator,
  ChangePasswordValidator,
};
