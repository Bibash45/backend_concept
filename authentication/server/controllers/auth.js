const User = require("../models/user");
const { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Nodemailer transporter configuration (using Mailtrap for testing)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "5202a2556f256c", // Replace with your actual Mailtrap username
    pass: "53994e16a07dd0", // Replace with your actual Mailtrap password
  },
});

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    // Email data
    const mailOptions = {
      from: "bibashcdry46@gmail.com",
      to: email,
      subject: "Account activation link ✔",
      text: "Hello world?",
      html: `
        <h1>Please use the following link to activate your account</h1>
        <a>${process.env.CLIENT_URL}/auth/activate/${token}</a>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    return res.json({
      message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
    });
  } catch (err) {
    console.log("SIGNUP EMAIL ERROR", err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.accountActivation = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          process.env.JWT_ACCOUNT_ACTIVATION,
          (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          }
        );
      });

      const { name, email, password } = decoded;
      const user = new User({ name, email, password });

      await user.save();

      // Generate a new JWT for the user (for future actions)
      const newToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token valid for 7 days
      );

      return res.json({
        message: "Signup success. Please signin.",
        token: newToken, // Return the new token
        user: { name: user.name, email: user.email }, // Return user data
      });
    } catch (err) {
      console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
      return res.status(401).json({
        error: "Expired link. Signup again",
      });
    }
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

// signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  // authenticate
  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email and password do not match",
    });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// protecting the read profile api endpoints
exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});
