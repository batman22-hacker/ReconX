const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

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

    /* ===== OTP SYSTEM (✅ FIXED) ===== */
    otp: {
      type: String,
    },

    otpExpires: {   // ✅ FIXED NAME
      type: Date,
    },

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