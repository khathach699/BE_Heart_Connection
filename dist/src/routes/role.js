"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolerController_1 = require("../controllers/rolerController");
const router = (0, express_1.Router)();
router.post("/create-role", rolerController_1.CreateRole);
exports.default = router;
//# sourceMappingURL=role.js.map