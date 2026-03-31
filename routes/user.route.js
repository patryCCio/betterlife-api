import express from "express";
import { login, setPoints } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.post("/login", login);
router.post("/set-points", setPoints);

export default router;