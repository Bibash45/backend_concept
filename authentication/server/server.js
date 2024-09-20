const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser"); // Optional: Can use express.json() instead
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// connect to db
require('./db/databaseConnection');

// import routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");

// app middlewares
app.use(morgan("dev"));
app.use(express.json()); // Alternative to body-parser
// app.use(cors()); // allows all origins

// Conditional CORS setup
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `http://localhost:3000` }));
}

// middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
