const axios = require("axios");

exports.name = "headers";

exports.run = async (target) => {
  const response = await axios.get(`https://${target}`, {
    timeout: 7000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return response.headers;
};