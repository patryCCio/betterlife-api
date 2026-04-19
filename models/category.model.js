import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CategorySchema = new mongoose.Schema(
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
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", CategorySchema);
