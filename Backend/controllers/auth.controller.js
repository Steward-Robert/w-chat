import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: `${fullName}, your account has been created successfully`,
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { fullName, email, password } = req.user;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(hashedPassword, password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ message: "intern server error" });
  }
};
