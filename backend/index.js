import express from "express"
import dotenv from "dotenv"
import database from "./utils/database.js";

dotenv.config()

const app = express()

app.use(express.json());

const port = process.env.PORT || 4000

database()

app.listen(port,()=>{
    console.log(`Server is Running at port No ${port}`)
})



