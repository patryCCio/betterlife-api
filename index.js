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
import scoreRoutes from "./routes/score.route.js";
import knowledgeRoutes from "./routes/knowledge.route.js";
import path from "path";

import { connectDB } from "./config/db.js"; // jeśli masz connectDB
import mongoose from "mongoose";
import { initInterval } from "./controllers/interval.controller.js";

dotenv.config();

const initServer = async (port) => {
  const app = express();

  const prefixApi = "/api/";

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(cors());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  connectDB()
    .then(() => {
      console.log("Połączono z MongoDB");
      console.log("Status:", mongoose.connection.readyState);
    })
    .catch((err) => {
      console.error("Mongo connect error:", err);
    })
    .finally(() => {
      console.log("Finalny status:", mongoose.connection.readyState);
      if (mongoose.connection.readyState == 1) {
        setInterval(() => { initInterval() }, 1000 * 60);
        initInterval();
      }
    });



  // trasy
  app.use(prefixApi + "todos", todoRoutes);
  app.use(prefixApi + "user", userRoutes);
  app.use(prefixApi + "awards", awardRoutes);
  app.use(prefixApi + "routines", routineRoutes);
  app.use(prefixApi + "scores", scoreRoutes);
  app.use(prefixApi + "knowledge", knowledgeRoutes);

  app.listen(port, () => {
    console.log("The server is listening at " + port);
  });
};

const getPort = async () => {
  initServer(process.env.PORT);
};

getPort();
