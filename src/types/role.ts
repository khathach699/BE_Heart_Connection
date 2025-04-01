import { Document } from "mongoose";

export interface IRole {
    name: string;
    isdeleted: boolean;
}

export interface IRoleDocument extends IRole, Document {
    createdAt: Date;
    updatedAt: Date;
}