import mongoose from "mongoose";
import { ICampaignTag, ICampaignTagDocument } from "../types/Camp_tag";
const { Schema } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";
const campTagSchema = new Schema<ICampaignTag>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: false,
  }
);

campTagSchema.plugin(mongoosePaginate);
const Camp_tag = mongoose.model<ICampaignTag, mongoose.PaginateModel<ICampaignTagDocument>>("CampTag", campTagSchema);
export default Camp_tag;
