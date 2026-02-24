const whois = require("whois-json");

exports.name = "whois";

exports.run = async (target) => {
  return await whois(target);
};