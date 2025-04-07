import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

interface IImgCampain {
  imgId?: number;
  imgUrl: string;
  isdeleted: boolean;
  CampID: mongoose.Types.ObjectId;
}

interface IImgCampainDocument extends IImgCampain, Document {}

const imgCampainSchema = new Schema<IImgCampainDocument>(
  {
    imgUrl: {
      type: String,
      required: true,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    CampID: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "imgcampaigns",
  }
);

imgCampainSchema.plugin(mongoosePaginate);
const ImgCampain = mongoose.model<
  IImgCampainDocument,
  mongoose.PaginateModel<IImgCampainDocument>
>("ImgCampain", imgCampainSchema);
export default ImgCampain;
