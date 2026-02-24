const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { scanEmail } = require("../controllers/email.controller");

/* ================= EMAIL SCAN ================= */

router.post("/scan", authMiddleware, scanEmail);

module.exports = router;