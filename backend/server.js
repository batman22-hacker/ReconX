require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

/* ================= CRITICAL ERROR HANDLERS ================= */

// Handle sync errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await connectDB(); // ✅ waits for DB
    console.log("✅ Database Connected");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🌐 BASE_URL: ${
          process.env.BASE_URL || `http://localhost:${PORT}`
        }`
      );
    });

    // Handle async errors (promises)
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();