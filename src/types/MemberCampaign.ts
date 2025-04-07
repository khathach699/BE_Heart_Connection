import { Document } from "mongoose";
import mongoose from "mongoose";

export interface IMemberCampaign {
  MemID?: number;
  UserID: mongoose.Types.ObjectId;
  CampID: mongoose.Types.ObjectId;
  StatusID: number;
  IsDelete: number;
  CreatedAt: Date;
}

export interface IMemberCampaignDocument extends IMemberCampaign, Document {}
