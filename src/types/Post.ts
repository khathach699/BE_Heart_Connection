import { Document, Types } from "mongoose";

export interface IPost {
    organization: Types.ObjectId;
    text: string;
    liked: number;
    isAccepted: boolean;
    isdeleted: boolean;
}

export interface IPostDocument extends IPost, Document {
    createdAt: Date;
    updatedAt: Date;
}