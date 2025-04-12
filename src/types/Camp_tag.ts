import { Document, Types } from "mongoose";

export interface ICampaignTag {
    campaign: Types.ObjectId;
    tag: Types.ObjectId;
    isdeleted: boolean;
}

export interface ICampaignTagDocument extends ICampaignTag, Document {
    createdAt: Date;
    updatedAt: Date;
}