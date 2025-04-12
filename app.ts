import dotenv from "dotenv";
import express, { NextFunction } from "express";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/users";
import roleRouter from "./src/routes/role";
import cors from "cors";

import RoleRouter from "./src/routes/roleRoute";
import organizationRouter from "./src/routes/organization";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { CreateErrorResponse } from "./src/utils/responnseHandler";
import stateRouter from "./src/routes/state";
import campaignRouter from "./src/routes/campaigns";
import postRouter from "./src/routes/posts";
import donate_CampaignRouter from "./src/routes/Donate_campaign";
import member_campaignRouter from "./src/routes/Member_campaign";
import Type_tagRouter from "./src/routes/Type_tag";
import TagRouter from "./src/routes/Tag";
import CampTagRouter from "./src/routes/Camp_tag";
import SocialTypeController from "./src/routes/social_type";
import UserSocialRouter from "./src/routes/User_social";
import notificationRouter from "./src/routes/notification";

dotenv.config();

const PORT = process.env.PORT || 3000;
const dbURL = "mongodb://localhost:27017/heart_connection";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/auth", userRouter);
app.use("/roles", RoleRouter);
app.use("/organizations", organizationRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/states", stateRouter);
app.use("/campaigns", campaignRouter);
app.use("/posts", postRouter);
app.use("/donate", donate_CampaignRouter);
app.use("/participate", member_campaignRouter);
app.use("/typetags", Type_tagRouter);
app.use("/tags", TagRouter);  
app.use("/camptags", CampTagRouter);
app.use("/socialtypes", SocialTypeController);
app.use("/usersocials", UserSocialRouter);
app.use("/notifications", notificationRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log(`Can not connect to db ${error}`);
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is starting at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  CreateErrorResponse(res, err.status || 500, err.message);
});
