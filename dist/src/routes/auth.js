"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validator_1 = require("../utils/validator");
const router = (0, express_1.Router)();
router.post("/register", validator_1.SignupValidator, validator_1.validate, authController_1.register);
router.post("/login", validator_1.LoginValidator, validator_1.validate, authController_1.login);
router.post("/logout", authController_1.logout);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password", authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map