const dns = require("dns").promises;

const checkEmailDNS = async (domain) => {
  let mxValid = false;
  let spfValid = false;
  let dmarcValid = false;

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords.length > 0) mxValid = true;
  } catch {}

  try {
    const txtRecords = await dns.resolveTxt(domain);
    txtRecords.flat().forEach((record) => {
      if (record.includes("v=spf1")) spfValid = true;
    });
  } catch {}

  try {
    const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
    if (dmarcRecords.length > 0) dmarcValid = true;
  } catch {}

  return { mxValid, spfValid, dmarcValid };
};

module.exports = { checkEmailDNS };