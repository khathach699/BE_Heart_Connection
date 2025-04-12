import mongoose from "mongoose";
import {ITypeTagDocument } from "../types/Type_tag";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;
const typeTagSchema = new Schema<ITypeTagDocument>(
  {
    name: {
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

typeTagSchema.plugin(mongoosePaginate);
const TypeTag = mongoose.model<ITypeTagDocument, mongoose.PaginateModel<ITypeTagDocument>>("TypeTag", typeTagSchema);
export default TypeTag;
