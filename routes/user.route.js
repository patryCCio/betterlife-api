import express from "express";
import { setPoints } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.post("/set-points", setPoints);

export default router;