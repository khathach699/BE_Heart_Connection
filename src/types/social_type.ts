import { Document, Types } from "mongoose";

export interface ISocialType {
    name: string;
    logo: string;
    isdeleted: boolean;
}

export interface ISocialTypeDocument extends ISocialType, Document {
    createdAt: Date;
    updatedAt: Date;
}