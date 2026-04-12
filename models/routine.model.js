import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RoutineSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  type: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: null,
  },
});

export const Routine = mongoose.model("Routine", RoutineSchema);
