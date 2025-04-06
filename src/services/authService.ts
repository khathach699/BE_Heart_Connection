import bcrypt from "bcrypt";
import userSchema from "../schemas/User";
import roleSchema from "../schemas/Role";
import { AUTH_ERRORS } from "../utils/constants";
import { sendMailForgotPassword } from "../utils/mailer";

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
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  (user as any).otpCode = otp;
  (user as any).otpExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  await sendMailForgotPassword(user.email, otp);
};

export const GetUserByOtp = async function (otp: string) {
  return await userSchema.findOne({
    otpCode: otp,
  });
};

export const ResetPassword = async function (otp: string, newPassword: string) {
  try {
    console.log(otp, newPassword);
    const user = await GetUserByOtp(otp);

    if (!user || Date.now() > (user as any).otpExpires) {
      throw new Error(AUTH_ERRORS.OTP_EXPIRED);
    }

    user.password = newPassword;
    (user as any).otpCode = null;
    (user as any).otpExpires = null;

    await user.save();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
