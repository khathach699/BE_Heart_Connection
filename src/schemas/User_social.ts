import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {IUserSocialDocument } from "../types/User_social";
const { Schema } = mongoose;
const userSocialSchema = new Schema<IUserSocialDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    social_type: {
      type: Schema.Types.ObjectId,
      ref: "social_type",
      required: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
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

userSocialSchema.plugin(mongoosePaginate);
const UserSocial = mongoose.model<IUserSocialDocument, mongoose.PaginateModel<IUserSocialDocument>>("UserSocial", userSocialSchema);
export default UserSocial;