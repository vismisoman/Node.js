const { sendEmail } = require("../common/email-service");
const { findByUsername, findByEmail } = require("../users/user.service");
const { updatePassword } = require("../auth/auth.service");
const jwt = require("jsonwebtoken");
const {
  getPasswordResetHtml,
  getPasswordResetSuccessHtml,
} = require("../common/helper");
module.exports = {
  createToken: (req, res) => {},

  /* To reset password using username */
  resetPasswordByUsername: async (req, res) => {
    const { username } = req.body;
    const user = await findByUsername(username);
    if (!user || user.length == 0) {
      return handleUsernameDoesnotExists(
        { searchType: "username", value: username },
        res
      );
    }
    return completeResetRequest(user, req, res);
  },

  /*
   * To reset password using email
   * req.body : email
   */
  resetPasswordByEmail: async (req, res) => {
    const { email } = req.body;
    const user = await findByEmail(email);
    if (!user || user.length == 0) {
      return handleUsernameDoesnotExists(
        { searchType: "email", value: email },
        res
      );
    }
    return completeResetRequest(user, req, res);
  },

  /*
   * To update new password in db
   * req.body : email, newpassword, activationCode
   */
  updatePassword: async (req, res) => {
    //validate update password token
    const { email, newPassword, activationToken } = req.body;
    const user = await findByEmail(email);
    try {
      await jwt.verify(activationToken, process.env.JWT_KEY);
      var decoded = jwt.decode(activationToken);
    } catch (err) {
      res.send({ success: false, data: "Password reset token expired!" + err });
    }
    if (decoded.target === "update-password") {
      try {
        updatePassword(user._id, newPassword);
      } catch (err) {
        res
          .status(401)
          .send({ success: false, data: "Password updation failed" + err });
      }
      return completeUpdatePassword(email, req, res);
    }
    return res
      .status(401)
      .send({ status: false, message: "Password updation failed" });
  },
};

function handleUsernameDoesnotExists(data, res) {
  return res.status(404).send({
    status: false,
    message: data.searchType + " " + data.value + " does not exists",
  });
}
/*
 * Method to complete reset password request
 * and sending email with token to reset it
 */
async function completeResetRequest(user, req, res) {
  const resetToken = resetPasswordToken(user.username, user.email);
  console.log("resetToken ", resetToken);
  // send email with
  const html = await getPasswordResetHtml(resetToken);
  sendEmail(
    process.env.ADMIN_EMAIL,
    user.email,
    process.env.RESET_PASSWORD_SUB,
    html
  )
    .then((result) =>
      res
        .status(200)
        .send({ success: true, message: "Reset password email sent" })
    )
    .catch((err) => {
      res
        .status(500)
        .send({ success: false, message: "Password reset failed" });
    });
}

/*
 * Method to create jwt token for reset password
 */
function resetPasswordToken(userid, email) {
  // TODO: Move expiry to config file
  return jwt.sign(
    { userid, email, target: "update-password" },
    process.env.JWT_KEY,
    { expiresIn: 3600 }
  );
}
/*
 * Method to complete update password request
 * and sending email success email
 */
async function completeUpdatePassword(user, req, res) {
  // send email with
  const html = await getPasswordResetSuccessHtml();
  try {
    await sendEmail(
      process.env.ADMIN_EMAIL,
      user,
      process.env.RESET_PASSWORD_SUCC,
      html
    );
    res.send({ success: true, message: "Password updation email sent!" });
  } catch (err) {
    res.send({ success: false, message: "Password couldnot updatd!" });
  }
}
