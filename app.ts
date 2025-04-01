import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/users";
import cors from "cors";
import RoleRouter from "./src/routes/roleRoute";
import organizationRouter from "./src/routes/organization";  
dotenv.config();

const PORT = process.env.PORT || 3000;
const dbURL = "mongodb://localhost:27017/heart_connection";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", userRouter);
app.use("/users", userRouter);
app.use("/roles", RoleRouter);
app.use("/organizations", organizationRouter);
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
