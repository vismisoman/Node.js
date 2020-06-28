const {
  findByUsernameOrEmail,
  findByUsername,
  createUserActivation,
  updateUserLogin,
  createUser,
  cleanUpEntries,
  activateUser,
} = require("./user.service");
const { sendEmail } = require("../common/email-service");
const {
  getActivationToken,
  encryptPassword,
  generateToken,
} = require("../auth/auth.service");
const { sign } = require("jsonwebtoken");
const { getActivationHtml } = require("../common/helper");
const User = require("../model/user-schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../common/logger").log;

module.exports = {
  /*
   * Method for user signup
   * req.body :username, password, email, fullname
   */
  signupUser: async (req, res) => {
    logger("signup user", req.body);
    const { username, password, email, fullname } = req.body;
    const isExists = await isUserExits(username);
    if (isExists) {
      return sendUserUserAlreadyExists(res);
    }

    let activationToken;
    let userData;
    let userActivation;
    bcrypt
      .genSalt()
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) =>
        createUser({
          username,
          password: hashedPassword,
          email,
          fullname,
        })
      )
      .then((newUser) => {
        userData = newUser;
        activationToken = getActivationToken(newUser.username, newUser.email);
        return createUserActivation(newUser.username, activationToken);
      })
      .then((activation) => {
        userActivation = activation;
        return getActivationHtml(activationToken);
      })
      .then((html) =>
        sendEmail(
          process.env.ADMIN_EMAIL,
          email,
          process.env.WELCOME_EMAIL_SUB,
          html
        )
      )
      .then(() =>
        res
          .status(200)
          .send({ success: true, data: "User created and email sent!" })
      )
      .catch((err) => {
        cleanUpEntries(userData, userActivation);
        return res
          .status(500)
          .send({ success: false, data: "failed to created user" });
      });
  },
  /*
   * Method for login
   * req.body :username, password
   */
  login: async (req, res) => {
    logger("login user", req.body);
    const { username, password } = req.body;
    // find user by username
    const user = await findByUsername(username);
    console.log("user", user);
    if (user == null || user.length == 0) {
      return res.send({
        success: false,
        data: "Username does not exists",
      });
    }
    if (!user.active) {
      console.log("user.active", user.active);
      return res
        .status(401)
        .json({ status: false, message: "User is not activated" });
    }
    //compare pasword
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = generateToken();
      updateUserLogin(user);
      return res.status(200).json({
        token: token,
        status: true,
        message: "Login successful!",
      });
    }
    return res
      .status(401)
      .json({ status: false, message: "Invalid credentials" });
  },

  /*
   * Method to activate the new user
   * req.body :activationToken
   */
  activate: async (req, res) => {
    console.log("activate user");
    //logger("activate user", req.body);
    const { activationToken } = req.body;
    try {
      const token = await jwt.verify(activationToken, process.env.JWT_KEY);
      console.log("token", token);
      var decoded = jwt.decode(activationToken);
      // console.log("decoded", decoded.payload());
    } catch (err) {
      console.log("activate Activation token expired");
      res.send({ success: false, data: "Activation token expired!" + err });
    }
    activateUser(decoded.username)
      .then(() => {
        return res.status(200).json({ success: true, message: "Activated!" });
      })
      .catch((err) => {
        console.log("err", err);
        return res
          .status(401)
          .json({ success: false, message: "Activation failed!" });
      });
  },
};

function sendUserUserAlreadyExists(res) {
  return res.send({
    success: false,
    data: "Username/Email already exists",
  });
}

async function isUserExits(username) {
  const user = await findByUsername(username);
  return user && user.length > 0;
}
