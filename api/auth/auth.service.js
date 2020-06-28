const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user-schema");
module.exports = {
  /* Method to generate jwt token using username and email */
  getActivationToken: (username, email) => {
    // TODO: Move expiry to config file
    return jwt.sign({ username, email }, process.env.JWT_KEY, {
      expiresIn: 3600,
    });
  },

  /* Method to password hashing */
  encryptPassword: async (password) => {
    const salt = await bcrypt.genSalt();
    bcrypt.hash(password, salt, function (err, result) {
      return result;
    });
  },

  /* Method to generate jwt token */
  generateToken: (data, expiry) =>
    jwt.sign(
      {
        data,
      },
      process.env.JWT_KEY,
      { expiresIn: 3600 }
    ),

  /* Method to update the new password to DB */
  updatePassword: async (userId, password) => {
    bcrypt
      .genSalt()
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { password: hashedPassword }
        ).exec();
      })
      .catch((err) => new Error("failed to update password"));
  },
};
