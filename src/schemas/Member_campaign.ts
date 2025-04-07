import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IMemberCampaign, IMemberCampaignDocument } from "../types/Member_campaign";
const { Schema } = mongoose;
const memberCampaignSchema = new Schema<IMemberCampaign>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
      min: 0,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
memberCampaignSchema.plugin(mongoosePaginate);
const MemberCampaign = mongoose.model<IMemberCampaign, mongoose.PaginateModel<IMemberCampaignDocument>>("Member_Campaign", memberCampaignSchema);
export default MemberCampaign;