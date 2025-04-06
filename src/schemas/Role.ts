import mongoose from "mongoose";
import { IRoleDocument } from "../types/role";

const Schema = mongoose.Schema;
const roleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    isdeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model<IRoleDocument>("Role", roleSchema);
export default Role;
