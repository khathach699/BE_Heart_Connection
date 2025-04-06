import mongoose, { Model, Document } from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";
import { IUser, IUserDocument } from "../types/user";

interface UserDocument extends IUser, Document {
  isModified(path: string): boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    // username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    point: { type: Number, default: 0 },
    isdisable: { type: Boolean, default: false },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    otpCode: { type: String },
    otpExpires: { type: Number },
    isdeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

userSchema.pre("save", function (this: UserDocument, next) {
  if (this.isModified("password")) {
    let salt = bcrypt.genSaltSync(10);
    let encrypted = bcrypt.hashSync(this.password, salt);
    this.password = encrypted;
  }
  next();
});

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
