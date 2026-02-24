const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const scanRoutes = require("./routes/scan.routes");
const emailRoutes = require("./routes/email.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://reconxcyberoperations.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

/* =========================
   SECURITY
========================= */

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: "10kb" }));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/email", emailRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ReconX Secure Backend Running",
    timestamp: new Date(),
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(errorMiddleware);

module.exports = app;