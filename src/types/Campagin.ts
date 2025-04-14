import { Document, Types } from "mongoose";

export interface ICampaign {
  name: string;
  organization: Types.ObjectId;
  state: Types.ObjectId;
  content: string;
  numberOfPeople: number;
  amountOfMoney: number;
  donate: number;
  isAccepted: boolean;
  isdeleted: boolean;
  Start: Date;
  NumberOfDay: number;
  participated: number;
  img: string | null;
}

export interface ICampaignDocument extends ICampaign, Document {
  createdAt: Date;
  updatedAt: Date;
}
