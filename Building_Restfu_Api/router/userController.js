import express from "express";
import User from "../models/userSchema.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, age, email, address } = req.body;
  // Check if all required fields are provided
  if (!name || !age || !email || !address) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const user = new User({ name, age, email, address });
    await user.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("error creating user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getuser", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error("error fetching user", err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.patch("/update", (req, res) => {
    const id = req.query.id;
  const { name, age, email, address } = req.body;
  User.findByIdAndUpdate(id, { name, age, email, address }, { new: true })
    .then((user) => {
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
      res.json(user);
    })
    .catch((err) => {
      console.error("error updating user", err);
      res.status(500).json({ message: "Internal error" });
    });
});
router.put("/put", (req, res) => {
  const { name, age, email, address } = req.body;
  User.findOneAndUpdate({name}, { age, email, address }, { new: true })
    .then((user) => {
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
      res.json(user);
    })
    .catch((err) => {
      console.error("error updating user", err);
      res.status(500).json({ message: "Internal error" });
    });
});


router.delete("/delete", (req, res) => {
  const id = req.query.id;
  User.findByIdAndDelete(id,{new:true})
    .then((user) => {
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
      res.json(user);
    })
    .catch((err) => {
      console.error("error deleting user", err);
      res.status(500).json({ message: "Internal error" });
    });
});

export default router;
