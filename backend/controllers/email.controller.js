const Scan = require("../models/scan.model");

const { checkBreaches } = require("../services/email/breachService");
const { checkEmailDNS } = require("../services/email/emailDnsService");
const { checkDisposable } = require("../services/email/disposableCheck");
const { calculateEmailRisk } = require("../services/email/emailRiskEngine");

/* ================= EMAIL SCAN CONTROLLER ================= */

const scanEmail = async (req, res) => {
  try {
    const { email, consent } = req.body;

    /* ===== Validation ===== */

    if (!email || consent !== true) {
      return res.status(400).json({
        msg: "Valid email and consent required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: "Invalid email format",
      });
    }

    const domain = email.split("@")[1];

    /* ===== Intelligence Modules ===== */

    let breachData = { count: 0 };
    let dnsData = {
      mxValid: false,
      spfValid: false,
      dmarcValid: false,
    };
    let disposable = false;
    let risk = { score: 0, riskLevel: "Low" };

    try {
      breachData = await checkBreaches(email);
    } catch (err) {
      console.error("Breach check failed:", err.message);
    }

    try {
      dnsData = await checkEmailDNS(domain);
    } catch (err) {
      console.error("DNS check failed:", err.message);
    }

    try {
      disposable = checkDisposable(domain);
    } catch (err) {
      console.error("Disposable check failed:", err.message);
    }

    try {
      risk = calculateEmailRisk({
        breachCount: breachData?.count || 0,
        ...dnsData,
        disposable,
      });
    } catch (err) {
      console.error("Risk calculation failed:", err.message);
    }

    /* ===== Save Scan (FIXED: user added) ===== */

    const scan = await Scan.create({
      user: req.user.id,   // 🔥 REQUIRED FIELD FIX
      target: email,
      scanType: "email",
      result: {
        breachData,
        dnsData,
        disposable,
      },
      securityScore: risk.score,
      riskLevel: risk.riskLevel,
      consentGiven: true,
    });

    return res.status(200).json(scan);

  } catch (error) {
    console.error("EMAIL CONTROLLER CRASH:", error);

    return res.status(500).json({
      msg: "Email scan failed",
    });
  }
};

module.exports = { scanEmail };