"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const organizationService_1 = __importDefault(require("../services/organizationService"));
const responnseHandler_1 = require("../utils/responnseHandler");
const responnseHandler_2 = require("../utils/responnseHandler");
class OrganizationController {
    requestUpgradeToOrganization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId; // Giả sử userId đang đăng nhập
                if (!userId) {
                    throw res.status(400).json({ message: "User ID is required" });
                }
                const orgData = {
                    info: req.body.info,
                    certificate: req.body.certificate,
                    bankName: req.body.bankName,
                    bankNumber: req.body.bankNumber,
                };
                const organization = yield organizationService_1.default.requestUpgradeToOrganization(userId, orgData);
                res.status(201).json({
                    message: "Organization request created, awaiting approval",
                    organization,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    approveOrganization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orgId = req.params.id; // Giả sử orgId được gửi từ admin
                if (!orgId) {
                    throw res.status(400).json({ message: "Organization ID is required" });
                }
                const organization = yield organizationService_1.default.approveOrganization(orgId);
                res.status(200).json({ message: "Organization approved", organization });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    rejectOrganization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orgId = req.params.id;
                if (!orgId) {
                    throw res.status(400).json({ message: "Organization ID is required" });
                }
                const organization = yield organizationService_1.default.rejectOrganization(orgId);
                res
                    .status(200)
                    .json({ message: "Organization request rejected", organization });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAllOrganizations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const isVerified = req.query.isVerified === "true"
                    ? true
                    : req.query.isVerified === "false"
                        ? false
                        : undefined;
                const result = yield organizationService_1.default.getAllOrganizations(page, limit, isVerified);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getOrganizationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orgId = req.params.id;
                if (!orgId) {
                    throw res.status(400).json({ message: "Organization ID is required" });
                }
                const organization = yield organizationService_1.default.getOrganizationById(orgId);
                res.status(200).json(organization);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    deleteOrganization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orgId = req.params.id;
                if (!orgId) {
                    throw res.status(400).json({ message: "Organization ID is required" });
                }
                const organization = yield organizationService_1.default.deleteOrganization(orgId);
                res.status(200).json({ message: "Organization deleted", organization });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    getAllOrganizationsWasReject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield organizationService_1.default.getAllOrganizationsWasReject(page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getOrganizationByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                if (!userId) {
                    throw res.status(400).json({ message: "User ID is required" });
                }
                const organization = yield organizationService_1.default.getOrganizationByUserId(userId);
                (0, responnseHandler_2.CreateSuccessResponse)(res, 200, organization);
            }
            catch (error) {
                (0, responnseHandler_1.CreateErrorResponse)(res, 404, error.message);
            }
        });
    }
}
exports.OrganizationController = OrganizationController;
exports.default = new OrganizationController();
//# sourceMappingURL=organizationController.js.map