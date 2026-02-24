const calculateEmailRisk = ({
  breachCount,
  mx,
  spf,
  dmarc,
  disposable,
}) => {
  let score = 100;

  if (breachCount > 0) score -= breachCount * 10;
  if (!mx) score -= 15;
  if (!spf) score -= 10;
  if (!dmarc) score -= 10;
  if (disposable) score -= 25;

  if (score < 0) score = 0;

  let riskLevel =
    score < 40
      ? "Critical"
      : score < 60
      ? "High"
      : score < 80
      ? "Medium"
      : "Low";

  return { score, riskLevel };
};

module.exports = { calculateEmailRisk };