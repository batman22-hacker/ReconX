const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  verifyOtp,        // ✅ ADD
  resendOtp         // ✅ ADD
} = require("../controllers/auth.controller");

// ===== EXISTING ROUTES =====
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);

// ===== OTP ROUTES (🔥 ADD THESE) =====
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;