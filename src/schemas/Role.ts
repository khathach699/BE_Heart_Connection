import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isdeleted: { type: Boolean, required: true, default: false },
});

const Role = mongoose.model("Role", roleSchema);
export default Role;
