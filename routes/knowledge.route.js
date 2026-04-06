import express from "express";
import { getKnowledge, saveKnowledge } from "../controllers/knowledge.controller.js";

const router = express.Router();

router.get("/", getKnowledge);
router.post("/", saveKnowledge);

export default router;