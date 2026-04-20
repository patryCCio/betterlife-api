import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SessionSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  user_uuid: {
    type: String,
    required: true,
    index: true,
  },
  refresh_token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "0s" },
  }
}, { timestamps: true });

export const Session = mongoose.model("Session", SessionSchema);
