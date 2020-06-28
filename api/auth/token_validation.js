require("dotenv/config");
const jwt = require("jsonwebtoken");

//JWT validation
function validate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed!!!!" });
  }
}

module.exports = validate;
