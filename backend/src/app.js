import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectToDB();



app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/auth",authRouter);

export default app; 