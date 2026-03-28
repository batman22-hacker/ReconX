const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sendEmail = require("../utils/email");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    /* ===== Validation ===== */

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    /* ===== Check Existing User ===== */

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    /* ===== Hash Password ===== */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ===== Generate OTP ===== */

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    /* ===== Create User ===== */

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    /* ===== Send Email ===== */

    await sendEmail(
      email,
      "ReconX OTP Verification",
      `Your OTP is: ${otp}`
    );

    res.status(201).json({
      message: "User registered. OTP sent to email.",
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND OTP ================= */

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "ReconX OTP",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({
      message: "OTP resent successfully",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ===== Check User ===== */

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ===== Check Verified ===== */

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    /* ===== Check Password ===== */

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ===== Generate Token ===== */

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REFRESH TOKEN ================= */

exports.refreshToken = (req, res) => {
  res.status(200).json({
    message: "Refresh token endpoint working",
  });
};

/* ================= LOGOUT ================= */

exports.logout = (req, res) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
};