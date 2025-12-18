import express from "express";
import dotenv from "dotenv";
import database from "./utils/database.js";
import userRouter from "./route/UserRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geoRouter from "./route/routeRouter.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

database();

app.use("/api/v1", userRouter);

app.use("/api/v2",geoRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
