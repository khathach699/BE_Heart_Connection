import { Document, Types } from "mongoose";

export interface IOrganization {
    info?: string;
    certificate: string;
    bankName: string;
    bankNumber: string;
    isdeleted: boolean;
    user: Types.ObjectId;
    isVerified: boolean;
}

export interface IOrganizationDocument extends IOrganization, Document {
    createdAt: Date;
    updatedAt: Date;
}