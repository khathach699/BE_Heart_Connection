"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../controllers/roleController"));
const router = (0, express_1.Router)();
router.get("/", roleController_1.default.getAllRoles);
router.post("/", roleController_1.default.createRole);
exports.default = router;
//# sourceMappingURL=roleRoute.js.map