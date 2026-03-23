import express from "express";
import { addAward, deleteAward, getAwards } from "../controllers/award.controller.js";

const router = express.Router();

router.get("/", getAwards);
router.post("/", addAward);
router.delete("/:uuid", deleteAward);

export default router;