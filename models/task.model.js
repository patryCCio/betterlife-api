import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TaskSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // 🔥 automatycznie generuje unikalne uuid
      unique: true,
    },
    user_uuid: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: String,
      default: null,
    },
    done: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// indeksy pod wydajność
TaskSchema.index({ parentId: 1 });
TaskSchema.index({ done: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ deadline: 1 });

export const Task = mongoose.model("Task", TaskSchema);
