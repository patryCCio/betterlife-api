import express from "express";
import {
    getTodos,
    addTask,
    updateTask,
    deleteTask,
    toggleDone
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTodos);                  // GET todos (tree)
router.post("/", addTask);                  // ADD task / subtask
router.patch("/:uuid", updateTask);         // EDIT
router.patch("/:uuid/done", toggleDone);    // TOGGLE DONE (+ children)
router.delete("/:uuid", deleteTask);        // DELETE (+ subtree)

export default router;