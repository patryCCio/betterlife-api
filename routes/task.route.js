import express from "express";
import {
  getTodos,
  addTask,
  updateTask,
  toggleDone,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/:user_uuid", getTodos);
router.post("/:user_uuid", addTask);
router.put("/:user_uuid/:uuid", updateTask);
router.patch("/:user_uuid/:uuid/toggle", toggleDone);
router.delete("/:user_uuid/:uuid", deleteTask);

export default router;
