const Scan = require("../models/Scan");
const axios = require("axios");

// Simple header scan
exports.runHeaderScan = async (req, res) => {
  try {
    const { target } = req.body;

    if (!target) {
      return res.status(400).json({ message: "Target required" });
    }

    const response = await axios.get(`https://${target}`);

    const headers = response.headers;

    // Basic scoring logic
    let score = 100;

    if (!headers["x-frame-options"]) score -= 10;
    if (!headers["content-security-policy"]) score -= 20;
    if (!headers["strict-transport-security"]) score -= 15;

    let risk = "Low";
    if (score < 80) risk = "Medium";
    if (score < 60) risk = "High";
    if (score < 40) risk = "Critical";

    const scan = await Scan.create({
      target,
      scanType: "headers",
      result: headers,
      securityScore: score,
      riskLevel: risk,
    });

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: "Scan failed", error: error.message });
  }
};

// Get all scans
exports.getAllScans = async (req, res) => {
  const scans = await Scan.find().sort({ createdAt: -1 });
  res.json(scans);
};