import { Document, Types } from "mongoose";

export interface ITypeTag {
    name: string;
    isdeleted: boolean;
}

export interface ITypeTagDocument extends ITypeTag, Document {
    createdAt: Date;
    updatedAt: Date;
}