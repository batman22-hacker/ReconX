const disposableDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
];

const checkDisposable = (domain) => {
  return disposableDomains.includes(domain);
};

module.exports = { checkDisposable };