require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

/* ================= CRITICAL ERROR HANDLERS ================= */

// Sync errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    console.log("⏳ Starting server...");

    /* ✅ START SERVER FIRST */
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🌐 BASE_URL: ${
          process.env.BASE_URL || `http://localhost:${PORT}`
        }`
      );
    });

    /* ✅ CONNECT DB (NON-BLOCKING) */
    connectDB()
      .then(() => {
        console.log("✅ Database Connected");
      })
      .catch((err) => {
        console.error("❌ DB Connection Failed:", err.message);
      });

    /* Async errors */
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();