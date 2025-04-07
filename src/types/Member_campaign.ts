import { Document, Types } from "mongoose";

export interface IMemberCampaign {
    user: Types.ObjectId;
    campaign: Types.ObjectId;
    state: Types.ObjectId;
    isdeleted: boolean;
}

export interface IMemberCampaignDocument extends IMemberCampaign, Document {
    createdAt: Date;
    updatedAt: Date;
}