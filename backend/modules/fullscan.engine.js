const whoisModule = require("./whois.module");
const headersModule = require("./headers.module");

const modules = [whoisModule, headersModule];

exports.runFullScan = async (target) => {
  const results = {};

  for (const mod of modules) {
    try {
      results[mod.name] = await mod.run(target);
    } catch (err) {
      results[mod.name] = null;
    }
  }

  return results;
};