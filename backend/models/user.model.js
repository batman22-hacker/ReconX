const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "analyst", "admin"],
      default: "user",
    },

    /* ================= AUTH ================= */
    refreshToken: {
      type: String,
      default: null,
    },

    /* ================= EMAIL / OTP ================= */
    verificationToken: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    /* ================= PASSWORD RESET ================= */
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= 🔥 IMPORTANT FIX ================= */
/*
❌ REMOVE manual indexes to avoid duplicate warning
Mongoose already creates index for `unique: true`
*/

// ❌ REMOVE THESE (IMPORTANT)
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);