import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    // username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    point: { type: Number, default: 0 },
    isdisable: { type: Boolean, default: false },
    role: {
      type: mongoose.Types.ObjectId,
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

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let salt = bcrypt.genSaltSync(10);
    let encrypted = bcrypt.hashSync(this.password, salt);
    this.password = encrypted;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
