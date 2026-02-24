const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    target: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    scanType: {
      type: String,
      enum: ["whois", "headers", "full", "email"],
      required: true,
    },

    result: {
      type: Object,
      default: null,
    },

    securityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: null,
    },

    consentGiven: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scan", scanSchema);