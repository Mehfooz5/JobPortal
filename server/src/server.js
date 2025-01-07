import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// middlewares



ConnectDB()
  .then(() => {
    app.on("error", (err) => {
      throw err;
    });
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
