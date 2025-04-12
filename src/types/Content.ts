import { Document } from "mongoose";

export interface IContent {
    code: string;
    message: string;
    isDeleted: boolean;
}

export interface IContentDocument extends IContent, Document {
    createdAt: Date;
    updatedAt: Date;
}
