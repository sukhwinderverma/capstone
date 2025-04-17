import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;

mongoose.connect(MONGO_CONNECTION_STRING);

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected");
  });
  