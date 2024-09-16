const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    console.log("REQ BODY ON SIGNUP :", req.body);
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    
    // Save the user to the database
    await newUser.save();

    res.json({
      message: "Signup successful! Please signin",
    });
  } catch (err) {
    console.log("SIGNUP ERROR", err);
    return res.status(400).json({
      error: err.message, // Return the error message
    });
  }
};


