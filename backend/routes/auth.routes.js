const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail
} = require("../controllers/auth.controller");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later."
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);

module.exports = router;