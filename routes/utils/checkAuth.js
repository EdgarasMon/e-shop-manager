const jwt = require("jsonwebtoken");
const config = require("../../config");

checkAuth = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.slice(7);
    if (!bearerToken)
        return res.status(401).json({ message: "Unathorized User" });
    try {
        const decoded = await jwt.verify(token, config.jwtSecret);
        if (decoded) next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = checkAuth;
