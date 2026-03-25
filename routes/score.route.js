import express from "express";
import { addScore, getScores } from "../controllers/score.controller.js";

const router = express.Router();

router.get("/", getScores);
router.post("/", addScore);

export default router;
