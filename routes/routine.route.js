import express from "express";
import { addRoutine, deleteRoutine, getRoutine, checkRoutine } from "../controllers/routine.controller.js";

const router = express.Router();

router.get("/", getRoutine);
router.post("/check", checkRoutine);
router.post("/", addRoutine);
router.delete("/:uuid", deleteRoutine);

export default router;