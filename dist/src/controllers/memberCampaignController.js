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
exports.MemberCampaignController = void 0;
const memberCampaignService_1 = __importDefault(require("../services/memberCampaignService"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class MemberCampaignController {
    constructor() {
        this.getUserCampaigns = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.body.userId;
                // Thử lấy ID từ token JWT nếu không có trong body
                if (!userId && req.headers.authorization) {
                    const token = req.headers.authorization.split(" ")[1];
                    try {
                        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
                        if (decoded && decoded.id) {
                            userId = decoded.id;
                            console.log("Using ID from JWT token:", userId);
                        }
                    }
                    catch (err) {
                        console.error("Error decoding JWT:", err);
                    }
                }
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: "User ID is required",
                    });
                }
                console.log("User ID from request:", userId);
                // Chuyển đổi userId thành ObjectId nếu là chuỗi
                const userObjectId = mongoose_1.default.Types.ObjectId.isValid(userId)
                    ? new mongoose_1.default.Types.ObjectId(userId)
                    : userId;
                const memberCampaigns = yield memberCampaignService_1.default.getUserCampaigns(userObjectId);
                return res.status(200).json({
                    success: true,
                    data: {
                        memberCampaigns,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MemberCampaignController = MemberCampaignController;
exports.default = new MemberCampaignController();
//# sourceMappingURL=memberCampaignController.js.map