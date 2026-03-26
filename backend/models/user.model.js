const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["user", "analyst", "admin"],
      default: "user",
    },

    /* ===== AUTH ===== */
    refreshToken: String,

    /* ===== EMAIL VERIFICATION ===== */
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ===== OTP SYSTEM (🔥 ADDED ONLY THIS) ===== */
    otp: String,
    otpExpiry: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },

    /* ===== PASSWORD RESET ===== */
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);