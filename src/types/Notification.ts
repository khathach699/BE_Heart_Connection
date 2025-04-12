import { Document, Types } from "mongoose";

export interface INotification {
    user: Types.ObjectId;
    content: Types.ObjectId; 
    isRead: boolean;
    isDeleted: boolean;
}

export interface INotificationDocument extends INotification, Document {
    createdAt: Date;
    updatedAt: Date;
}
