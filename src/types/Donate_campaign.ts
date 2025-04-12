import { Document, Types } from "mongoose";

export interface IDonateCampaign {
    user: Types.ObjectId;
    campaign: Types.ObjectId;
    content: string;
    money: number;
    isdeleted: boolean;
}

export interface IDonateCampaignDocument extends IDonateCampaign, Document {
    createdAt: Date;
    updatedAt: Date;
}