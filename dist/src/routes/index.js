"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const role_1 = __importDefault(require("./role"));
const roleRoute_1 = __importDefault(require("./roleRoute"));
const organization_1 = __importDefault(require("./organization"));
const state_1 = __importDefault(require("./state"));
const campaigns_1 = __importDefault(require("./campaigns"));
const posts_1 = __importDefault(require("./posts"));
const memberCampaign_1 = __importDefault(require("./memberCampaign"));
const router = express_1.default.Router();
// Register all routes
router.use("/auth", auth_1.default);
router.use("/users", users_1.default);
router.use("/roles", role_1.default);
router.use("/roles", roleRoute_1.default);
router.use("/organizations", organization_1.default);
router.use("/states", state_1.default);
router.use("/campaigns", campaigns_1.default);
router.use("/posts", posts_1.default);
router.use("/member-campaign", memberCampaign_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map