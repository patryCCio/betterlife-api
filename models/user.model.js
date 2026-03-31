import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        nickname: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        points: {
            type: Number,
            default: 0
        },
    }
);

export const User = mongoose.model("User", UserSchema);