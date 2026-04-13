import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RoutineDaySchema = new mongoose.Schema(
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
    routine_uuid: {
      type: String,
      ref: "Routine",
      required: true,
    },
    series: {
      type: Number,
      default: 0,
      required: true,
    },
    other_count: {
      type: Number,
      default: 0,
    },
    series_other_count: {
      type: Number,
      default: 0,
    },
    last_date: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  },
);

export const RoutineDay = mongoose.model("RoutineDay", RoutineDaySchema);
