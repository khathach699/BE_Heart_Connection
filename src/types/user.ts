import { Document, Types } from "mongoose";

export interface IUser {
  fullname: string;
  password: string;
  avatar?: string | null;
  email: string;
  point?: number;
  isdisable?: boolean;
  isdeleted?: boolean;
  role: Types.ObjectId;
  organization?: Types.ObjectId | null;
  otpCode?: string;
  otpExpires?: number;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
