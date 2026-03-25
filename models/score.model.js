import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ScoreSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    user_uuid: {
      type: String,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Score = mongoose.model("Score", ScoreSchema);
