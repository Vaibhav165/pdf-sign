import mongoose from "mongoose";

const connectDB = async () =>
  mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL);

export default connectDB;
