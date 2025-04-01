"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const volunteerController_1 = __importDefault(require("../controllers/volunteerController"));
const router = (0, express_1.Router)();
router.post("/register", userController_1.register);
//
router.post("/update", volunteerController_1.default.createUser.bind(volunteerController_1.default));
router.get("/", volunteerController_1.default.getAllUsers.bind(volunteerController_1.default));
router.get("/:id", volunteerController_1.default.getUserById.bind(volunteerController_1.default));
router.put("/:id", volunteerController_1.default.updateUser.bind(volunteerController_1.default));
router.delete("/:id", volunteerController_1.default.deleteUser.bind(volunteerController_1.default));
exports.default = router;
//# sourceMappingURL=users.js.map