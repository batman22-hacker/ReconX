require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

/* =========================
   START SERVER
========================= */

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 ReconX running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

/* =========================
   UNHANDLED ERRORS
========================= */

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});