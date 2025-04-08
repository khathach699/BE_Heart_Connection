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
exports.MemberCampaignService = void 0;
const MemberCampaign_1 = __importDefault(require("../schemas/MemberCampaign"));
const Campaign_1 = __importDefault(require("../schemas/Campaign"));
const ImgCampain_1 = __importDefault(require("../schemas/ImgCampain"));
class MemberCampaignService {
    getUserCampaigns(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Searching for user ID:", userId);
                // Find all member-campaign records for the user
                const memberCampaigns = yield MemberCampaign_1.default.find({
                    UserID: userId,
                    IsDelete: 0,
                });
                console.log("Found member campaigns:", memberCampaigns.length);
                // Không tìm thấy dữ liệu, kiểm tra collection MemberCampaign có dữ liệu không
                if (memberCampaigns.length === 0) {
                    const allMemberCampaigns = yield MemberCampaign_1.default.find({});
                    console.log("Total member campaigns in database:", allMemberCampaigns.length);
                    if (allMemberCampaigns.length > 0) {
                        console.log("Sample UserIDs in database:", allMemberCampaigns.slice(0, 3).map((mc) => mc.UserID));
                    }
                }
                // Get campaign details for each member-campaign record
                const campaignsWithDetails = yield Promise.all(memberCampaigns.map((mc) => __awaiter(this, void 0, void 0, function* () {
                    console.log("Processing campaign with ID:", mc.CampID);
                    const campaign = yield Campaign_1.default.findOne({
                        _id: mc.CampID,
                        isdeleted: false,
                    })
                        .populate("organization")
                        .setOptions({ strictPopulate: false });
                    console.log("Found campaign:", campaign ? "Yes" : "No");
                    // Get campaign images
                    const images = yield ImgCampain_1.default.find({
                        CampID: mc.CampID,
                        isdeleted: false,
                    });
                    console.log("Found images:", images.length);
                    return Object.assign(Object.assign({}, mc.toObject()), { campaign: campaign
                            ? Object.assign(Object.assign({}, campaign.toObject()), { images: images }) : null });
                })));
                return campaignsWithDetails;
            }
            catch (error) {
                console.error("Error in getUserCampaigns:", error);
                throw new Error(`Error fetching user campaigns: ${error.message}`);
            }
        });
    }
}
exports.MemberCampaignService = MemberCampaignService;
exports.default = new MemberCampaignService();
//# sourceMappingURL=memberCampaignService.js.map