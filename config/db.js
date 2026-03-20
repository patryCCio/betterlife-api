import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/betterlife");
        console.log("MongoDB connected ✅ (baza: betterlife)");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};