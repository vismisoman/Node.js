require("dotenv/config");
const express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

/*
 * This is for accessToken and refreshToken generation
 * publicKey:req.body.key
 * privateKey: req.headers
 */
router.post("/token", function (req, res) {
  console.log("generating tocken");
  var publicKey = req.body.key;
  const authHeader = req.headers["authorization"];
  const privateKey = authHeader && authHeader.split(" ")[1];
  var token = {
    publicKey: publicKey,
    privateKey: privateKey,
  };
  var accessToken = generateAccessToken(token);
  var refreshToken = generateRefreshToken(token);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(token) {
  return jwt.sign(token, process.env.JWT_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}
function generateRefreshToken(token) {
  return (refreshToken = jwt.sign(token, process.env.JWT_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  }));
}

module.exports = router;
