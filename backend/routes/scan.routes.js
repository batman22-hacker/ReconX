const express = require("express");
const whois = require("whois-json");
const axios = require("axios");

const Scan = require("../models/scan.model");
const authMiddleware = require("../middleware/auth.middleware");
const { runFullScan } = require("../modules/fullscan.engine");

const router = express.Router();

/* ================= UTILITIES ================= */

const sanitizeDomain = (domain) =>
  domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

const calculateScore = (headers) => {
  let score = 100;
  Object.values(headers).forEach((v) => {
    if (!v) score -= 15;
  });
  return Math.max(score, 0);
};

const calculateRisk = (score) => {
  if (score === null) return null;
  if (score < 40) return "Critical";
  if (score < 60) return "High";
  if (score < 80) return "Medium";
  return "Low";
};

/* ================= WHOIS ================= */

router.post("/whois", authMiddleware, async (req, res, next) => {
  try {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ msg: "Domain required" });

    domain = sanitizeDomain(domain);

    const result = await whois(domain);

    const scan = await Scan.create({
      user: req.user.id,
      target: domain,
      scanType: "whois",
      result,
    });

    res.json(scan);
  } catch (err) {
    next(err);
  }
});

/* ================= HEADERS ================= */

router.post("/headers", authMiddleware, async (req, res, next) => {
  try {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ msg: "Domain required" });

    domain = sanitizeDomain(domain);

    const response = await axios.get(`https://${domain}`, {
      timeout: 7000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const headers = response.headers;

    const securityHeaders = {
      "X-Frame-Options": headers["x-frame-options"] || null,
      "X-Content-Type-Options": headers["x-content-type-options"] || null,
      "Content-Security-Policy": headers["content-security-policy"] || null,
      "Strict-Transport-Security": headers["strict-transport-security"] || null,
      "Referrer-Policy": headers["referrer-policy"] || null,
      "Permissions-Policy": headers["permissions-policy"] || null,
    };

    const score = calculateScore(securityHeaders);
    const riskLevel = calculateRisk(score);

    const scan = await Scan.create({
      user: req.user.id,
      target: domain,
      scanType: "headers",
      result: securityHeaders,
      securityScore: score,
      riskLevel,
    });

    res.json(scan);
  } catch (err) {
    next(err);
  }
});

/* ================= FULL SCAN (ENGINE-BASED) ================= */

router.post("/full-scan", authMiddleware, async (req, res, next) => {
  try {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ msg: "Domain required" });

    domain = sanitizeDomain(domain);

    const results = await runFullScan(domain);

    const scan = await Scan.create({
      user: req.user.id,
      target: domain,
      scanType: "full",
      result: results,
    });

    res.json(scan);
  } catch (err) {
    next(err);
  }
});

/* ================= HISTORY ================= */

router.get("/scans", authMiddleware, async (req, res, next) => {
  try {
    const scans = await Scan.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(scans);
  } catch (err) {
    next(err);
  }
});

module.exports = router;