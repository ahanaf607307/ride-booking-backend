import dotenv from "dotenv";
import express from "express";
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
dotenv.config();

let server: Server;
const app = express();

const startServer = async () => {
  try {
    console.log(envVars.NODE_ENV);
    await mongoose.connect(envVars.DB_URL);
    console.log("Db Connected Successfully ✅");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port -> ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Server Error", error);
  }
};

// call server and seed supper admin in IIFE function
(async () => {
  await startServer();
})();

// Unhandled Rejection.. it connected with promise

process.on("unhandledRejection", (err: Error) => {
  console.log(
    "Unhandled Rejection Detected... server shutting down... ->",
    err
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
// Promise.reject(new Error("I forgot to catch this error"));

// Uncaught Exception error-> it not connected with promise ..
process.on("uncaughtException", (err: Error) => {
  console.log(
    "Unhandled Rejection Detected... server shutting down... ->",
    err
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
// throw new Error("i forgot to handle this local error");

//SIGTERM error -> it not showing any error.. it can handle only server owner-----
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... server shutting down... ->");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
//SIGINT error -> it not showing any error.. it can handle only server owner-----
process.on("SIGINT", () => {
  console.log("SIGINT signal received... server shutting down... ->");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
