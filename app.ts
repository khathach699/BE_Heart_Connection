import dotenv from "dotenv";
import express, { NextFunction } from "express";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/users";
import roleRouter from "./src/routes/role";
import cors from "cors";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import { CreateErrorResponse } from "./src/utils/responnseHandler";
dotenv.config();

const PORT = process.env.PORT || 3001;
const dbURL = "mongodb://localhost:27017/heart_connection";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  CreateErrorResponse(res, err.status || 500, err.message);
});
