import mongoose from "mongoose";
import { IDonateCampaign, IDonateCampaignDocument } from "../types/Donate_campaign";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;
const donateCampaignSchema = new Schema<IDonateCampaign>(
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
    money: {
      type: Number,
      required: true,
      min: 0,
    },
    content: {
      type: String,
      default: "",
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

donateCampaignSchema.plugin(mongoosePaginate);
const DonateCampaign = mongoose.model<IDonateCampaign, mongoose.PaginateModel<IDonateCampaignDocument>>("Donate_Campaign", donateCampaignSchema);
export default DonateCampaign;
