import mongoose from "mongoose";
import {IStateDocument } from "../types/State";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const stateSchema = new Schema<IStateDocument>(
  {
    name: {
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

stateSchema.plugin(mongoosePaginate);
const State = mongoose.model<IStateDocument, mongoose.PaginateModel<IStateDocument>>("State", stateSchema);
export default State;
