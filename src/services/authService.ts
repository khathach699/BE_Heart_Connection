import bcrypt from "bcrypt";
import userSchema from "../schemas/User";
import roleSchema from "../schemas/Role";
import { AUTH_ERRORS } from "../utils/constants";
import { sendMailForgotPassword } from "../utils/mailer";

import crypto from "crypto";

export const GetAllUser = async function () {
  return await userSchema.find({}).populate("role");
};

export const GetUserByID = async function (id: string) {
  return await userSchema.findById(id).populate("role");
};

export const GetUserByEmail = async function (email: string) {
  return await userSchema
    .findOne({
      email: email,
    })
    .populate("role");
};

export const GetUserByToken = async function (token: string) {
  return await userSchema
    .findOne({
      resetPasswordToken: token,
    })
    .populate("role");
};

export const CreateAnUser = async function (
  email: string,
  password: string,
  fullname: string,
  role: string
) {
  try {
    let roleObj = await roleSchema.findOne({
      name: role,
    });

    console.log(fullname, password, email, role);
    if (roleObj) {
      let newUser = new userSchema({
        email: email,
        password: password,
        fullname: fullname,
        role: roleObj._id,
      });
      return await newUser.save();
    } else {
      throw new Error(AUTH_ERRORS.ROLE_NOT_FOUND);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdateAnUser = async function (
  id: string,
  body: Record<string, any>
) {
  let allowField = ["password", "email", "imgURL"];
  let getUser = await userSchema.findById(id);
  if (!getUser) {
    throw new Error("User not found");
  }
  for (const key of Object.keys(body)) {
    if (allowField.includes(key)) {
      (getUser as any)[key] = body[key];
    }
  }
  return await getUser.save();
};

export const DeleteAnUser = async function (id: string) {
  return await userSchema.findByIdAndUpdate(
    id,
    { status: false },
    {
      new: true,
    }
  );
};

export const CheckLogin = async function (email: string, password: string) {
  let user = await userSchema.findOne({
    email: email,
  });

  if (!user) {
    throw new Error(AUTH_ERRORS.EMAIL_AND_PASSWORD_WRONG);
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      return user._id;
    } else {
      throw new Error(AUTH_ERRORS.EMAIL_AND_PASSWORD_WRONG);
    }
  }
};

export const Change_Password = async function (
  user: any,
  oldpassword: string,
  newpassword: string
) {
  if (bcrypt.compareSync(oldpassword, user.password)) {
    //doit pass
    user.password = newpassword;
    await user.save();
  } else {
    throw new Error(AUTH_ERRORS.WRONG_PASSWORD);
  }
};

export const ForgotPassword = async function (email: string) {
  let user = await GetUserByEmail(email);
  if (!user) {
    throw new Error(AUTH_ERRORS.EMAIL_NOT_FOUND);
  }
  (user as any).resetPasswordToken = crypto.randomBytes(32).toString("hex");
  (user as any).resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  let url =
    "http://localhost:3000/auth/resetpassword/" +
    (user as any).resetPasswordToken;
  await sendMailForgotPassword(user.email, url);
};

export const ResetPassword = async function (
  token: string,
  newPassword: string
) {
  try {
    let user = await GetUserByToken(token);
    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_TOKEN);
    }
    user.password = newPassword;
    (user as any).resetPasswordToken = null;
    (user as any).resetPasswordExpires = null;
    await user.save();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
