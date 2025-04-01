import mongoose from "mongoose";
import { IOrganizationDocument } from "../types/Organization";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const organizationSchema = new Schema<IOrganizationDocument>(
  {
    info: {
      type: String,
    },
    certificate: {
      type: String, required: true
    },
    bankName: {
      type: String,
    },
    bankNumber: {
      type: String,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
organizationSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.user && ret.user.organization) {
      delete ret.user.organization; // Loại bỏ organization trong user
    }
    return ret;
  },
});
organizationSchema.plugin(mongoosePaginate);
const Organization = mongoose.model<IOrganizationDocument, mongoose.PaginateModel<IOrganizationDocument>>("Organization", organizationSchema);
export default Organization;
