const jwt = require("jsonwebtoken");
const config = require("../../config");


// TODO fix the authorization
authorization = async (req, res, next) => {
    const bearerToken = req.header("Authorization");
    // const token = bearerToken.slice(7);
    console.log("********", bearerToken);
    if (!bearerToken) return res.status(401).json({ message: "Unathorized User" });
    try {
        const decoded = await jwt.verify(bearerToken, config.jwtSecret, {
            expiresIn: "1h",
        });
        console.log('decoded', decoded);

        if (decoded) {
            res.cookie("token", bearerToken, {
                httpOnly: true,
            });
            //return res.redirect('/');
            console.log("--------decoded----");
            req.userId = decoded.userId;
            next();
        }
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authorization;
