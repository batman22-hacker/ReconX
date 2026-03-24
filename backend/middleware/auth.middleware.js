const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 IMPORTANT: Use SAME secret as login
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decoded; // { id, role }

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};