require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 ReconX running on http://localhost:${PORT}`);
      console.log(`🌐 BASE_URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();