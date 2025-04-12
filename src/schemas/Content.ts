import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IContentDocument } from "../types/Content";
const { Schema } = mongoose;

const contentSchema = new Schema<IContentDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    message: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.plugin(mongoosePaginate);
const Content = mongoose.model<IContentDocument, mongoose.PaginateModel<IContentDocument>>("Content", contentSchema);
export default Content;
