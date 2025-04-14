import mongoose from "mongoose";
import { ICampaignDocument } from "../types/Campagin";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const campaignSchema = new Schema<ICampaignDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    content: {
      type: String,
    },
    numberOfPeople: {
      type: Number,
      default: 0,
    },
    amountOfMoney: {
      type: Number,
      default: 0,
    },
    donate: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    Start: {
      type: Date,
      required: true,
    },
    NumberOfDay: {
      type: Number,
      required: true,
    },
    participated: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.plugin(mongoosePaginate);
const Campaign = mongoose.model<
  ICampaignDocument,
  mongoose.PaginateModel<ICampaignDocument>
>("Campaign", campaignSchema);
export default Campaign;
