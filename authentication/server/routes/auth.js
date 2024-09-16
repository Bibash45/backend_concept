const express = require("express");

const router = express.Router();

// import controller
const { signup } = require("../controllers/auth");

// import validator
const { userSignupValidator } = require("../validators/auth");
const { runValidation } = require("../validators/index");

// signup routes
router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = router;
