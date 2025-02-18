import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import AnalsisRouter from './routes/index'
dotenv.config();



const app: express.Application = express();
app.use(express.json())
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening now to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });


  app.use ('/api',AnalsisRouter)