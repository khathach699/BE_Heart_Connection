import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ISocialType, ISocialTypeDocument } from "../types/social_type";
const { Schema } = mongoose;

const socialTypeSchema = new Schema<ISocialType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
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

socialTypeSchema.plugin(mongoosePaginate);
const SocialType = mongoose.model<ISocialType, mongoose.PaginateModel<ISocialTypeDocument>>("social_type", socialTypeSchema);
export default SocialType;
