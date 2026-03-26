const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshToken,
  logout,
  verifyOtp,
  resendOtp,
} = require("../controllers/auth.controller");

/* ================= RATE LIMIT ================= */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

/* ================= AUTH ROUTES ================= */

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

/* ❌ REMOVED verifyEmail (causing crash) */

/* ================= OTP ================= */

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;