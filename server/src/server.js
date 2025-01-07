import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import cors from "cors";
import GlobalErrorHandler from "./config/errorHandler.js";
import userRouter from "./routes/user.routes.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173/",
  })
);
app.use(express.json());

app.use(GlobalErrorHandler);

app.use("/api/v1/user", userRouter)

  

function serverStart() {
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
}  

serverStart()