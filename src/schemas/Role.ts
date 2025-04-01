import mongoose from "mongoose";
import { IRoleDocument } from "../types/role";
const Schema = mongoose.Schema;
const roleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true, unique: true },
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Role = mongoose.model<IRoleDocument>("Role", roleSchema);
export default Role;
