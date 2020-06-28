const router = require("express").Router();
const {
  createToken,
  resetPasswordByUsername,
  resetPasswordByEmail,
  updatePassword,
} = require("./auth.controller");
const checkToken = require("./token_validation");

router.post("/token", createToken);
router.post("/resetpassword/by-username", checkToken, resetPasswordByUsername);
router.post("/resetpassword/by-email", checkToken, resetPasswordByEmail);
router.post("/updatepassword", checkToken, updatePassword);

module.exports = router;
