import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import router from "./router/userController.js";

const app = express();
dotenv.config();

// database connection
connectDb();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Sever started on ${PORT}`);
});
