import { Document, Types } from "mongoose";

export interface ITag {
    name: string;
    description: string;
    typeTag: Types.ObjectId;
    isdeleted: boolean;
}

export interface ITagDocument extends ITag, Document {
    createdAt: Date;
    updatedAt: Date;
}