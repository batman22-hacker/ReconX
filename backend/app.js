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

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://reconx-eta.vercel.app"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests without origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // allow localhost + ALL vercel deployments
    if (
      allowedOrigins.includes(origin) ||
      origin.includes("vercel.app")
    ) {
      return callback(null, true);
    }

    // ❗ IMPORTANT FIX (was false before)
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ================= CORS ================= */

app.use(cors(corsOptions));

/* ================= SECURITY ================= */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

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