/* eslint-disable no-undef */
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// trasy
import todoRoutes from "./routes/todo.route.js";

dotenv.config();

export const initServer = (port) => {
  const app = express();
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(cors());

  // trasy
  app.use("/api/todos", todoRoutes);

  app.listen(port, () => {
    console.log("The server is listening at " + port);
  });
};

export const getPort = async () => {
  return process.env.PORT;
};
