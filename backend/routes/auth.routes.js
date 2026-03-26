const express = require("express");
const router = express.Router(); // ✅ FIXED (this was missing)

const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
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
router.get("/verify/:token", verifyEmail);

/* ================= OTP ROUTES ================= */

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

/* ================= EXPORT ================= */

module.exports = router;