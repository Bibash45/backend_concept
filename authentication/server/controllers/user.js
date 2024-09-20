const User = require("../models/user");

exports.read = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Error reading user" });
    });
};

exports.update = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Find the user by their ID (from the decoded JWT)
    const user = await User.findOne({ _id: req.auth._id });
    
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Validate and update the user's name
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    // If a password is provided, validate and update it
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be at least 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    // Save the updated user data to the database
    const updatedUser = await user.save();
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    // Return the updated user details
    return res.json(updatedUser);
  } catch (err) {
    // Handle any errors that occur during the process
    console.log("USER UPDATE ERROR", err);
    return res.status(400).json({
      error: "User update failed",
    });
  }
};

