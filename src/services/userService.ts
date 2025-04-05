import User from "../schemas/User";
import { getAccessToken } from "../utils/getAccessToken";
import bcrypt from "bcrypt";

export const registerUser = async (
  email: string,
  password: string,
  fullname: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const newUser = new User({ email, password, fullname });
  await newUser.save();

  return {
    _id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Sai mật khẩu");
  }

  const token = await getAccessToken({
    _id: user._id,
    email: user.email,
    rule: user.rule ?? 1,
  });

  return {
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
    token,
  };
};

export const forgotPassword = async (email: string) => {};
