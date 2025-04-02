import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IPostDocument } from "../types/Post";
const { Schema } = mongoose;

const postSchema = new Schema<IPostDocument>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    text: {
      type: String,
    },
    liked: {
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
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(mongoosePaginate);
const Post = mongoose.model<IPostDocument, mongoose.PaginateModel<IPostDocument>>("Post", postSchema);
export default Post;
