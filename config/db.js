import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://patryccio:${process.env.AUTH_MONGOOSE}@betterlife.4z6hjsv.mongodb.net/betterlife?appName=Betterlife`);
        console.log("MongoDB connected ✅ (baza: betterlife)");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};