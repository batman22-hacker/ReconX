const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ msg: "No token, access denied" });

  try {
    const token = authHeader.split(" ")[1]; // Extract Bearer token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains { id: ... }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};