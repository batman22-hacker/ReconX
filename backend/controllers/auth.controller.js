const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    /* ===== Validation ===== */

    if (!username || !password) {
      return res.status(400).json({
        msg: "Username and password are required",
      });
    }

    /* ===== Check Existing User ===== */

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Username or email already exists",
      });
    }

    /* ===== Hash Password ===== */

    const hashedPassword = await bcrypt.hash(password, 12);

    /* ===== Create User ===== */

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      msg: "User registered successfully",
      userId: newUser._id,
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    /* ===== Validation ===== */

    if (!username || !password) {
      return res.status(400).json({
        msg: "Username and password are required",
      });
    }

    /* ===== Find User ===== */

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    /* ===== Compare Password ===== */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    /* ===== Generate JWT ===== */

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};