const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isLength({ min: 4, max: 15 })
    .withMessage("name must be atleast 4 character and maximum 10"),

  check("email").isEmail().withMessage("Invalid email"),

  check("password")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 character long"),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Invalid email"),

  check("password")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 character long"),
];
