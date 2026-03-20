import express from "express";
import * as TodoController from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/get", TodoController.getTodo);
router.post("/", TodoController.addTodo);
router.delete("/:id", TodoController.deleteTodo);

export default router;
