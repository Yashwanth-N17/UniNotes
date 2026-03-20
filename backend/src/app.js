import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectToDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import resourcesRouter from "./routes/resources.routes.js";

const app = express();
connectToDB();



app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || true);
  },
  credentials: true,
}));
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/resources", resourcesRouter);

export default app;