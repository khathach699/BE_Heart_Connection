import mongoose from "mongoose";
import { IMemberCampaignDocument } from "../types/MemberCampaign";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const memberCampaignSchema = new Schema<IMemberCampaignDocument>(
  {
    UserID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    CampID: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    StatusID: {
      type: Number,
      required: true,
    },
    IsDelete: {
      type: Number,
      default: 0,
    },
    CreatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "membercampaigns",
  }
);

memberCampaignSchema.plugin(mongoosePaginate);
const MemberCampaign = mongoose.model<
  IMemberCampaignDocument,
  mongoose.PaginateModel<IMemberCampaignDocument>
>("MemberCampaign", memberCampaignSchema);
export default MemberCampaign;
