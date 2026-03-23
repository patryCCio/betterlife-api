import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const AwardSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        cost: {
            type: Number,
            required: true
        },
    }
);

export const Award = mongoose.model("Award", AwardSchema);