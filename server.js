import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import MongoDbConnect from "./config/MongoDb.js";
import studentRouter from "./router/studentRouter.js";
import authRouter from "./router/studentAuth.js";
import courseRouter from "./router/courseRouter.js";
import teacherRouter from "./router/teacherRouter.js";
import noticeRouter from "./router/noticeRouter.js";

import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//dotenv config
dotenv.config();

// Port

const PORT = process.env.PORT || 9090;

//init express
const app = express();

//static folder
app.use(express.static("public"));

//middleware support
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Router
app.use("/api/v1/", studentRouter);
app.use("/api/v1/", courseRouter);
app.use("/api/v1/", teacherRouter);
app.use("/api/v1/notice", noticeRouter);
app.use(authRouter);

//errorHandler
app.use(errorHandler);
app.listen(PORT, () => {
  MongoDbConnect();
  console.log(`server is runnig on port ${PORT}`.bgGreen.black);
});
