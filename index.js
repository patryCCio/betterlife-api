/* eslint-disable no-undef */
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// trasy
import todoRoutes from "./routes/todo.route.js";
import path from "path";

dotenv.config();

const initServer = (port) => {
  const app = express();

  const prefixApi = "/api/";

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(cors());

  // trasy
  app.use(prefixApi + "todos", todoRoutes);
  app.listen(port, () => {
    console.log("The server is listening at " + port);
  });
};

const getPort = async () => {
  initServer(process.env.PORT);
};

getPort();
