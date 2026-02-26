import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI as string;

    if (!mongoURI) {
      throw new Error("MONGO_URI not found");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};