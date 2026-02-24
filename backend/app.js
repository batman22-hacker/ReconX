const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const scanRoutes = require("./routes/scan.routes");
const emailRoutes = require("./routes/email.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

/* ================= SECURITY LAYER ================= */

// CORS (restrict in production)
app.use(
  cors({
    origin: "*", // Replace with frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Secure headers
app.use(helmet());

// Rate limiting (global)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/email", emailRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ReconX Secure Backend Running",
    timestamp: new Date(),
  });
});

/* ================= ERROR HANDLER ================= */

app.use(errorMiddleware);

module.exports = app;