import express from "express"
import dotenv from "dotenv"
import database from "./utils/database.js";
import userRouter from "./route/UserRoute.js";

import cookieParser from "cookie-parser";

dotenv.config()

const app = express()



app.use(express.json());

app.use(cookieParser())

const port = process.env.PORT || 4000

database()

app.use("/api/v1",userRouter)

app.listen(port,()=>{
    console.log(`Server is Running at port No ${port}`)
})



