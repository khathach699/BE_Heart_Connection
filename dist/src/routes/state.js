"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stateController_1 = __importDefault(require("../controllers/stateController"));
const router = (0, express_1.Router)();
router.post("/", stateController_1.default.createState.bind(stateController_1.default));
router.get("/", stateController_1.default.getAllStates.bind(stateController_1.default));
router.get("/:id", stateController_1.default.getStateById.bind(stateController_1.default));
router.put("/:id", stateController_1.default.updateState.bind(stateController_1.default));
router.delete("/:id", stateController_1.default.deleteState.bind(stateController_1.default));
exports.default = router;
//# sourceMappingURL=state.js.map