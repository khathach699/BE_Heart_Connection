import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument } from "../types/user";
import mongoosePaginate from "mongoose-paginate-v2";// Thêm plugin phân trang
// Nhớ thêm username và role vào types/user
const Schema = mongoose.Schema;
const userSchema = new Schema<IUserDocument>(
  {
    // username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true ,select: false}, // select: false ẩn password
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    point: { type: Number, default: 0 },
    isdisable: { type: Boolean, default: false },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", default: null },
    isdeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    let salt = bcrypt.genSaltSync(10);
    let encrypted = bcrypt.hashSync(this.password, salt);
    this.password = encrypted;
  }
  next();
});
userSchema.plugin(mongoosePaginate);// Thêm plugin phân trang
//const User = mongoose.model("User", userSchema);
const User = mongoose.model<IUserDocument, mongoose.PaginateModel<IUserDocument>>("User", userSchema);
export default User;
