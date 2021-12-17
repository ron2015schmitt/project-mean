const jwt = require("jsonwebtoken");
const secret = require('../middleware/secret');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secret);
    } catch (error) {
        return res.status(401).json({
            message: "check-auth.js: Auth failed during token verification",
        });
    }
};