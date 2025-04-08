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
exports.OrganizationService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Organization_1 = __importDefault(require("../schemas/Organization"));
const User_1 = __importDefault(require("../schemas/User"));
const userService_1 = __importDefault(require("./userService"));
const Role_1 = __importDefault(require("../schemas/Role"));
class OrganizationService {
    requestUpgradeToOrganization(userId, orgData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_1.default.getUserById(userId);
                console.log(user);
                if (!user)
                    throw new Error("User not found");
                if (user.organization)
                    throw new Error("User already has an organization");
                const existingRequest = yield Organization_1.default.findOne({
                    user: userId,
                    isdeleted: false,
                });
                if (existingRequest)
                    throw new Error("User already has a request for organization upgrade");
                const organization = new Organization_1.default(Object.assign(Object.assign({}, orgData), { user: userId, isVerified: false }));
                const savedOrg = yield organization.save();
                return savedOrg;
            }
            catch (error) {
                throw new Error(`Error requesting organization: ${error.message}`);
            }
        });
    }
    approveOrganization(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organization = yield Organization_1.default.findOne({
                    _id: orgId,
                    isdeleted: false,
                });
                if (!organization)
                    throw new Error("Organization not found");
                if (organization.isVerified)
                    throw new Error("Organization already verified");
                organization.isVerified = true;
                yield organization.save();
                // Cập nhật role của user thành "Organization"
                const user = yield User_1.default.findById(organization.user);
                if (user) {
                    const orgRole = yield Role_1.default.findOne({ name: "Organization" });
                    if (!orgRole)
                        throw new Error("Role 'Organization' not found");
                    user.role = orgRole._id;
                    user.organization = organization._id;
                    yield user.save();
                }
                return organization;
            }
            catch (error) {
                throw new Error(`Error approving organization: ${error.message}`);
            }
        });
    }
    rejectOrganization(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organization = yield Organization_1.default.findById(orgId);
                if (!organization)
                    throw new Error("Organization not found");
                if (organization.isVerified)
                    throw new Error("Organization already verified, cannot reject");
                organization.isdeleted = true;
                yield organization.save();
                return organization;
            }
            catch (error) {
                throw new Error(`Error rejecting organization: ${error.message}`);
            }
        });
    }
    getAllOrganizations() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, isVerified) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: "user",
                };
                const query = { isdeleted: false };
                if (isVerified !== undefined) {
                    query.isVerified = isVerified;
                }
                const result = yield Organization_1.default.paginate(query, options);
                return {
                    organizations: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching organizations: ${error.message}`);
            }
        });
    }
    getOrganizationById(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organization = yield Organization_1.default.findOne({
                    _id: orgId,
                    isdeleted: false,
                }).populate("user");
                if (!organization)
                    throw new Error("Organization not found");
                return organization;
            }
            catch (error) {
                throw new Error(`Error fetching organization: ${error.message}`);
            }
        });
    }
    deleteOrganization(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Organization_1.default.deleteOne({
                    _id: orgId,
                    isVerified: false,
                    isdeleted: true,
                });
                if (result.deletedCount === 0) {
                    throw new Error("Organization not found or already verified");
                }
            }
            catch (error) {
                throw new Error(`Error deleting organization: ${error.message}`);
            }
        });
    }
    getAllOrganizationsWasReject() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: "user",
                };
                const result = yield Organization_1.default.paginate({ isdeleted: true }, options);
                return {
                    organizations: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching organizations: ${error.message}`);
            }
        });
    }
    getOrganizationByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Looking for organization with userId:", userId);
                // Kiểm tra định dạng ID MongoDB hợp lệ
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    console.log("Invalid MongoDB ObjectId format");
                    throw new Error("Invalid user ID format");
                }
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                // Tìm với trường user (theo schema)
                let organization = yield Organization_1.default.findOne({
                    user: objectId,
                    isdeleted: false,
                });
                // Nếu không tìm thấy, thử với UserId (theo dữ liệu thực tế)
                if (!organization) {
                    console.log("Not found with 'user', trying with 'UserId'");
                    organization = yield Organization_1.default.findOne({
                        UserId: objectId,
                        IsDelete: false,
                    });
                }
                if (!organization) {
                    console.log("No organization found for userId:", userId);
                    throw new Error("Organization not found");
                }
                console.log("Found organization:", organization._id);
                return organization;
            }
            catch (error) {
                console.error("Error in getOrganizationByUserId:", error);
                throw new Error(`Error fetching organization: ${error.message}`);
            }
        });
    }
}
exports.OrganizationService = OrganizationService;
exports.default = new OrganizationService();
//# sourceMappingURL=organizationService.js.map