import mongoose from "mongoose";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ULR_CONNECTION);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
