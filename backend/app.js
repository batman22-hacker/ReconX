const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const scanRoutes = require("./routes/scan.routes");
const emailRoutes = require("./routes/email.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

/* ================= 🔥 TRUST PROXY (CRITICAL FIX) ================= */
app.set("trust proxy", 1);

/* ================= CORS ================= */

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://reconx-eta.vercel.app",
    "https://reconx-git-main-mohammed-ajmal-khans-projects.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

/* ================= SECURITY ================= */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ================= RATE LIMIT ================= */

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/email", emailRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ReconX Secure Backend Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

/* ================= ERROR HANDLER ================= */

app.use(errorMiddleware);

module.exports = app;