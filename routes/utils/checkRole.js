const jwt = require("jsonwebtoken");
const config = require("../../config");

checkRole = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken.slice(7);
  const { role } = jwt.decode(token);
  if (role !== "admin") {
    return res.status(403).json({ message: "invalid action for user" });
  } else next();
};

module.exports = checkRole;
