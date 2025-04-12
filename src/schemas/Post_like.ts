import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postLikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId, 
      ref: "Post",
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

// Create compound index to prevent duplicate likes
postLikeSchema.index({ user: 1, post: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeSchema);
export default PostLike;
