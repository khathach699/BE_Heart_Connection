import { ITagDocument} from "../types/Tag";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const { Schema } = mongoose;
const tagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    typeTag: {
      type: Schema.Types.ObjectId,
      ref: "TypeTag",
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

tagSchema.plugin(mongoosePaginate);
const Tag = mongoose.model<ITagDocument, mongoose.PaginateModel<ITagDocument>>("Tag", tagSchema);
export default Tag;
