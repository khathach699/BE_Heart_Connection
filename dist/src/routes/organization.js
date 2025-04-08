"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizationController_1 = __importDefault(require("../controllers/organizationController"));
const router = express_1.default.Router();
router.post("/request", organizationController_1.default.requestUpgradeToOrganization.bind(organizationController_1.default));
router.put("/approve/:id", organizationController_1.default.approveOrganization);
router.put("/reject/:id", organizationController_1.default.rejectOrganization);
router.get("/", organizationController_1.default.getAllOrganizations);
router.get("/trash", organizationController_1.default.getAllOrganizationsWasReject.bind(organizationController_1.default));
router.get("/user/:id", organizationController_1.default.getOrganizationByUserId);
router.get("/:id", organizationController_1.default.getOrganizationById);
router.delete("/:id", organizationController_1.default.deleteOrganization.bind(organizationController_1.default));
exports.default = router;
//# sourceMappingURL=organization.js.map