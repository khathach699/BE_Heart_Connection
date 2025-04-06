import { Document } from "mongoose";

export interface IState {
    name: string;
    isdeleted: boolean;
}

export interface IStateDocument extends IState, Document {
    createdAt: Date;
    updatedAt: Date;
}