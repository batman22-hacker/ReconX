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

/* ================= 🔥 TRUST PROXY (RENDER FIX) ================= */
app.set("trust proxy", 1);

/* ================= 🔥 CORS (PRODUCTION SAFE) ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://reconx-eta.vercel.app",
  "https://reconx-git-main-mohammed-ajmal-khans-projects.vercel.app",
  "https://reconx-68asqrb5i-mohammed-ajmal-khans-projects.vercel.app", // 🔥 add new deploy
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps / postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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

/* ================= BODY PARSER ================= */

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