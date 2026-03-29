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
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* ===== Check Existing User ===== */
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    /* ===== Hash Password ===== */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ===== Generate OTP ===== */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("📲 OTP (DEV MODE):", otp);

    /* ===== Create User ===== */
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // ✅ FIXED
      isVerified: false,
    });

    /* ===== Send Email (NON-BLOCKING) ===== */
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail(
          email,
          "ReconX OTP Verification",
          `Your OTP is: ${otp}`
        );
      }
    } catch (err) {
      console.error("⚠️ Email failed but continuing:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registered. OTP sent.",
    });

  } catch (error) {
    console.error("❌ Register Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= VERIFY OTP ================= */

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* 🔥 FIX 1: STRING MATCH */
    if (!user.otp || String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    /* 🔥 FIX 2: EXPIRY */
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    /* ===== SUCCESS ===== */
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= RESEND OTP ================= */

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("📲 RESENT OTP:", otp);

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // ✅ FIXED

    await user.save();

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail(
          email,
          "ReconX OTP",
          `Your OTP is: ${otp}`
        );
      }
    } catch (err) {
      console.error("⚠️ Email resend failed:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= REFRESH TOKEN ================= */

exports.refreshToken = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Refresh token working",
  });
};

/* ================= LOGOUT ================= */

exports.logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};