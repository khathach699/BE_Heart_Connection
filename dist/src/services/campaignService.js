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
exports.CampaignService = void 0;
const Campaign_1 = __importDefault(require("../schemas/Campaign"));
const ImgCampain_1 = __importDefault(require("../schemas/ImgCampain"));
class CampaignService {
    approveCampaign(campaignID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_1.default.findOne({
                    _id: campaignID,
                    isdeleted: false,
                });
                if (!campaign)
                    throw new Error("Campaign not found");
                if (campaign.isAccepted)
                    throw new Error("Campaign already accepted");
                campaign.isAccepted = true;
                yield campaign.save();
                return campaign;
            }
            catch (error) {
                throw new Error(`Error approving campaign: ${error.message}`);
            }
        });
    }
    rejectCampaign(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_1.default.findById(campaignId);
                if (!campaign)
                    throw new Error("Campaign not found");
                if (campaign.isAccepted)
                    throw new Error("Campaign already accepted, cannot be rejected");
                campaign.isdeleted = true;
                yield campaign.save();
                return campaign;
            }
            catch (error) {
                throw new Error(`Error rejecting campaign: ${error.message}`);
            }
        });
    }
    getAllCampaigns() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, isAccepted) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: [{ path: "organization" }, { path: "state" }],
                };
                const query = { isdeleted: false };
                if (isAccepted !== undefined) {
                    query.isAccepted = isAccepted;
                }
                const result = yield Campaign_1.default.paginate(query, options);
                return {
                    campaigns: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching campaigns: ${error.message}`);
            }
        });
    }
    getCampaignById(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_1.default.findOne({
                    _id: campaignId,
                    isdeleted: false,
                })
                    .populate("organization")
                    .populate("state");
                if (!campaign)
                    throw new Error("Campaign not found");
                return campaign;
            }
            catch (error) {
                throw new Error(`Error fetching campaign: ${error.message}`);
            }
        });
    }
    deleteCampaign(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Campaign_1.default.findOneAndUpdate({ _id: campaignId, isdeleted: false }, { isdeleted: true }, { new: true });
                if (!result) {
                    throw new Error("Campaign not found or already accepted");
                }
            }
            catch (error) {
                throw new Error(`Error deleting campaign: ${error.message}`);
            }
        });
    }
    getAllCampaignsWasReject() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: [{ path: "organization" }, { path: "state" }],
                };
                const result = yield Campaign_1.default.paginate({ isdeleted: true }, options);
                return {
                    campaigns: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching rejected campaigns: ${error.message}`);
            }
        });
    }
    getFeaturedCampaigns() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            try {
                const campaigns = yield Campaign_1.default.find({
                    isdeleted: false,
                    isAccepted: true,
                })
                    .sort({
                    participated: -1,
                    donate: -1,
                    dayStart: -1,
                })
                    .limit(limit)
                    .populate("organization")
                    .setOptions({ strictPopulate: false });
                const campaignsWithImages = yield Promise.all(campaigns.map((campaign) => __awaiter(this, void 0, void 0, function* () {
                    const images = yield ImgCampain_1.default.find({
                        CampID: campaign._id,
                        isdeleted: false,
                    });
                    return Object.assign(Object.assign({}, campaign.toObject()), { images: images, organizationInfo: campaign.organization && typeof campaign.organization === "object"
                            ? {
                                name: campaign.organization.Inform ||
                                    "Tổ chức không xác định",
                                logo: campaign.organization.logo ||
                                    "/src/assets/logos/avt.png",
                            }
                            : {
                                name: "Tổ chức không xác định",
                                logo: "/src/assets/logos/avt.png",
                            } });
                })));
                return campaignsWithImages;
            }
            catch (error) {
                throw new Error(`Error fetching featured campaigns: ${error.message}`);
            }
        });
    }
    getFeaturedActivities() {
        return __awaiter(this, arguments, void 0, function* (limit = 3) {
            try {
                console.log("getFeaturedActivities called with limit:", limit);
                // Lấy các chiến dịch đang diễn ra với thông tin tổ chức và ảnh
                const campaigns = yield Campaign_1.default.find({
                    isdeleted: false,
                    isAccepted: true,
                })
                    .sort({
                    participated: -1,
                    donate: -1,
                    dayStart: -1,
                })
                    .limit(limit)
                    .populate("organization")
                    .setOptions({ strictPopulate: false });
                console.log("Số lượng campaigns tìm thấy:", campaigns.length);
                if (campaigns.length === 0) {
                    console.log("Không tìm thấy chiến dịch nào thỏa mãn điều kiện");
                    return [];
                }
                // Debug organization data
                campaigns.forEach((campaign, index) => {
                    console.log(`Campaign ${index} organization:`, JSON.stringify(campaign.organization));
                });
                // Thêm hình ảnh cho mỗi hoạt động
                const activitiesWithImages = yield Promise.all(campaigns.map((campaign) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const images = yield ImgCampain_1.default.find({
                            CampID: campaign._id,
                            isdeleted: false,
                        });
                        console.log(`Campaign ${campaign._id}: Tìm thấy ${images.length} hình ảnh`);
                        // Convert to plain object first
                        const campaignObj = campaign.toObject();
                        console.log("Campaign object:", JSON.stringify(campaignObj));
                        // Extract organization info correctly
                        let organizationInfo = {
                            name: "Tổ chức không xác định",
                            logo: "/src/assets/logos/avt.png",
                        };
                        if (campaignObj.organization) {
                            console.log("Found organization:", JSON.stringify(campaignObj.organization));
                            organizationInfo = {
                                name: campaignObj.organization.Inform ||
                                    "Tổ chức không xác định",
                                logo: campaignObj.organization.logo ||
                                    "/src/assets/logos/avt.png",
                            };
                            console.log("Extracted organization info:", organizationInfo);
                        }
                        return Object.assign(Object.assign({}, campaignObj), { images: images, organizationInfo });
                    }
                    catch (error) {
                        console.error(`Lỗi khi xử lý campaign ${campaign._id}:`, error);
                        return Object.assign(Object.assign({}, campaign.toObject()), { images: [], organizationInfo: {
                                name: "Tổ chức không xác định",
                                logo: "/src/assets/logos/avt.png",
                            } });
                    }
                })));
                console.log("Final featured activities:", activitiesWithImages.length);
                return activitiesWithImages;
            }
            catch (error) {
                console.error("Error in getFeaturedActivities:", error);
                throw new Error(`Error fetching featured activities: ${error.message}`);
            }
        });
    }
}
exports.CampaignService = CampaignService;
exports.default = new CampaignService();
//# sourceMappingURL=campaignService.js.map