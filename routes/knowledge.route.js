import express from "express";
import {
  addKnowledgeCategory,
  getKnowledge,
  getKnowledgeCategory,
  deleteKnowledgeCategory,
  saveKnowledge,
} from "../controllers/knowledge.controller.js";

const router = express.Router();

router.get("/", getKnowledge);
router.get("/categories/:uuid", getKnowledgeCategory);
router.post("/categories", addKnowledgeCategory);
router.delete("/categories/:uuid", deleteKnowledgeCategory);
// router.delete("/")
router.post("/", saveKnowledge);

export default router;
