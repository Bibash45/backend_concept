const User = require("../models/user");
const { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

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

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.auth._id }).then((user) => {
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role != "admin") {
      return res.status(400).json({
        error: "Admin resource ,access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

// forgot password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User with this email does not exist",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    await user.updateOne({ resetPasswordLink: token });

    // Email data
    const mailOptions = {
      from: "bibashcdry46@gmail.com",
      to: email,
      subject: "Reset your password ✔",
      text: `Hello world? --- ${token}`,
      html: `
        <h1>Please use the following link to reset your password</h1>
        <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}">${process.env.CLIENT_URL}/auth/password/reset/${token}</a>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    return res.json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
    });
  } catch (err) {
    console.log("FORGOT PASSWORD ERROR", err);
    return res.status(400).json({
      error: "An error occurred while processing your request.",
    });
  }
};

// reset password controller
exports.resetPassword = async (req, res) => {
  console.log(req.body);

  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    try {
      const decoded = jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD
      );
      if (!decoded) {
        return res.status(400).json({
          error: "Invalid reset password link",
        });
      }

      let user = await User.findOne({ resetPasswordLink });
      if (!user) {
        return res.status(400).json({
          error: "Invalid link",
        });
      }

      user.password = newPassword;
      user.resetPasswordLink = "";
      await user.save();

      return res.json({
        message: "Password has been updated",
      });
    } catch (err) {
      console.log("RESET PASSWORD ERROR", err);
      return res.status(400).json({
        error: "Expired link. Try again",
      });
    }
  } else {
    return res.status(400).json({
      error: "No link provided",
    });
  }
};

// google login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Retrieve the payload

    // Ensure payload is defined before destructuring
    if (!payload) {
      return res.status(400).json({
        error: "Google login failed. No payload received.",
      });
    }

    const { email_verified, email, name } = payload; // Destructure from payload

    if (email_verified) {
      const user = await User.findOne({ email });

      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const { _id, role } = user; // Get role separately to avoid accessing before initialization
        return res.json({
          token,
          user: {
            _id,
            email,
            name,
            role,
          },
        });
      } else {
        let password = email + process.env.JWT_SECRET;
        const newUser = new User({
          name,
          email,
          password,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
          { _id: savedUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        const { _id, role } = savedUser; // Get role separately to avoid accessing before initialization
        return res.json({
          token,
          user: {
            _id,
            email,
            name,
            role,
          },
        });
      }
    } else {
      return res.status(400).json({
        error: "Google login failed. Email not verified.",
      });
    }
  } catch (err) {
    console.log("ERROR GOOGLE LOGIN", err);
    return res.status(400).json({
      error: "Failed to authenticate user",
    });
  }
};
