import express from "express";
import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");

  //   res.sendFile(__dirname + `/index.html`);
});
app.post("/", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  res.send(`sum is ${num1 + num2}`);
});

app.get("/bmicalculator", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html");
});
app.post("/bmicalculator", (req, res) => {
  const height = parseFloat(req.body.height);
  const weight = parseFloat(req.body.weight);
  let bmi = weight / (height * height);
  res.send(`Your BMI  is ${bmi}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
