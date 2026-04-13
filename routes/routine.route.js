import express from "express";
import { addRoutine, checkPoints, deleteRoutine, getRoutine } from "../controllers/routine.controller.js";

const router = express.Router();

router.get("/", getRoutine);
router.post("/", addRoutine);
router.post("/check-points", checkPoints);
router.delete("/:uuid", deleteRoutine);

export default router;