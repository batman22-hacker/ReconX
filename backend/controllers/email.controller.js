const Scan = require("../models/scan.model");

const { checkBreaches } = require("../services/email/breachService");
const { checkEmailDNS } = require("../services/email/emailDnsService");
const { checkDisposable } = require("../services/email/disposableCheck");
const { calculateEmailRisk } = require("../services/email/emailRiskEngine");

const scanEmail = async (req, res) => {
  try {
    const { email, consent } = req.body;

    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!email || consent !== true) {
      return res.status(400).json({
        msg: "Valid email and consent required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const domain = email.split("@")[1];

    const breachData = await checkBreaches(email).catch(() => ({ count: 0 }));
    const dnsData = await checkEmailDNS(domain).catch(() => ({
      mxValid: false,
      spfValid: false,
      dmarcValid: false,
    }));
    const disposable = checkDisposable(domain);

    const risk = calculateEmailRisk({
      breachCount: breachData?.count || 0,
      ...dnsData,
      disposable,
    });

    const scan = await Scan.create({
      user: req.user.id,
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

    res.json(scan);

  } catch (error) {
    console.error("EMAIL CONTROLLER CRASH:", error);
    res.status(500).json({ msg: "Email scan failed" });
  }
};

module.exports = { scanEmail };