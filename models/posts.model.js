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
    parent_id: {
      type: String,
      required: true,
      default: null,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", CategorySchema);
