import { Document, Types } from "mongoose";

export interface IUserSocial {
    user: Types.ObjectId;
    social_type: Types.ObjectId;
    link: string;
    isdeleted: boolean;
}

export interface IUserSocialDocument extends IUserSocial, Document {
    createdAt: Date;
    updatedAt: Date;
}