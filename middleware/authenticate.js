const jwt = require("jsonwebtoken");
const { jwtPvtKey } = require("../config/configEnv");

module.exports = function (req, res, next) {
  if (!req.headers["x-auth-token"]) {
    return res.status(401).json({
      error: true,
      message: "No Token",
    });
  }
  try {
    const token = req.headers["x-auth-token"];
    const decoded = jwt.verify(token, jwtPvtKey);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.json({
      error: true,
      message: "Invalid Token",
    });
  }
};
