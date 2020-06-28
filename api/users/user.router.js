const router = require("express").Router();
const checkToken = require("../auth/token_validation");
const {
  signupUser,
  activate,
  login,
  resetPassword,
} = require("./user.controller");
const { signupValidation } = require("../validators/user-validator");

router.post("/signup", checkToken, signupValidation, signupUser);
router.post("/activate", checkToken, activate);
router.post("/login", checkToken, login);

module.exports = router;
