import express from "express";
import dotenv from "dotenv";
import database from "./utils/database.js";
import userRouter from "./route/UserRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geoRouter from "./route/routeRouter.js";
import chat from "./route/chatRoute.js";
import eco from "./route/ecoRoute.js";
import city from "./route/cityPollution.js";

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

app.use("/api/v3",chat)

app.use("/api/v4",eco)

app.use("/api/v5",city)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
