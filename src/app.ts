import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { router } from "./app/router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cors());

app.use(cookieParser());
// ends for google authentication
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to our ride booking system backend",
    status: 200,
    success: true,
  });
});

// global error handler middleware ,
app.use(globalErrorHandler);
// route not found middleware
app.use(notFound);

export default app;
