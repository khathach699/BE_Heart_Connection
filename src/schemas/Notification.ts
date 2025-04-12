import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { INotificationDocument } from "../types/Notification";
const { Schema } = mongoose;

const notificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
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

notificationSchema.plugin(mongoosePaginate);
const Notification = mongoose.model<INotificationDocument, mongoose.PaginateModel<INotificationDocument>>("Notification", notificationSchema);
export default Notification;
