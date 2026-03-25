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

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://reconx-eta.vercel.app" // 🔥 IMPORTANT ADD THIS
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // ❗ ERROR THROW MAT KARO
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* ✅ MOST IMPORTANT LINE */
app.options("/*", cors(corsOptions));

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ReconX Secure Backend Running",
    environment: "local",
    timestamp: new Date(),
  });
});

app.use(errorMiddleware);

module.exports = app;