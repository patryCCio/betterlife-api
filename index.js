/* eslint-disable no-undef */
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// trasy
import todoRoutes from "./routes/task.route.js";
import userRoutes from "./routes/user.route.js";
import awardRoutes from "./routes/award.route.js";
import routineRoutes from "./routes/routine.route.js";
import path from "path";

import { connectDB } from "./config/db.js"; // jeśli masz connectDB


dotenv.config();

const initServer = (port) => {
  const app = express();

  const prefixApi = "/api/";

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(cors());

  connectDB().catch(err => console.error("Mongo connect error:", err));

  // trasy
  app.use(prefixApi + "todos", todoRoutes);
  app.use(prefixApi + "user", userRoutes);
  app.use(prefixApi + "awards", awardRoutes);
  app.use(prefixApi + "routines", routineRoutes);

  app.listen(port, () => {
    console.log("The server is listening at " + port);
  });
};

const getPort = async () => {
  initServer(process.env.PORT);
};

getPort();
