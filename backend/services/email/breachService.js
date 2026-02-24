const axios = require("axios");

const checkBreaches = async (email) => {
  try {
    if (!process.env.HIBP_API_KEY) {
      return { breached: false, count: 0, breaches: [] };
    }

    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
      {
        headers: {
          "hibp-api-key": process.env.HIBP_API_KEY,
          "user-agent": "ReconX-App",
        },
      }
    );

    return {
      breached: true,
      count: response.data.length,
      breaches: response.data.map((b) => b.Name),
    };
  } catch (err) {
    if (err.response?.status === 404) {
      return { breached: false, count: 0, breaches: [] };
    }

    console.error("HIBP Error:", err.message);

    return { breached: false, count: 0, breaches: [] };
  }
};

module.exports = { checkBreaches };