const logger = require("../common/logger").log;
const User = require("../model/user-schema");
const UserActivation = require("../model/user-activation-schema");
const jwt = require("jsonwebtoken");
module.exports = {
  find: (uniqueid) => {
    User.find({ uniqueid }, (err, result) => {
      logger("result ", result);
    });
  },
  // To find the user by using username
  findByUsername: (username) => {
    return User.findOne({ username })
      .then((user) => user)
      .catch((err) => {
        throw new Error("error finding user in database ", err).message;
      });
  },
  // To find the user by using email
  findByEmail: (email) => {
    return User.findOne({ email })
      .then((user) => user)
      .catch((err) => {
        throw new Error("error finding user in database ", err).message;
      });
  },
  // To find the user by using username or email
  findByUsernameOrEmail: (username, email) => {
    return (
      User.findOne({ username })
        //return User.find({ $or: [{ username }, { email }] })
        // .exec()
        .then((user) => user)
    );
  },
  // Method to create new user in db
  createUser: ({ username, password, email, fullname }) => {
    let user = new User({ username, password, email, fullname });
    return user
      .save()
      .then((user) => user)
      .catch((err) => new Error("failed to create user"));
  },

  // Method to create user activation details
  createUserActivation: (username, activation_code) => {
    let data = new UserActivation({ username, activation_code });
    return data.save().then((rec) => rec);
  },
  // Method to activate user
  activateUser: (username) => {
    return User.findOneAndUpdate({ username }, { active: true });
  },
  // Method to update user login details in db
  updateUserLogin: (user) => {
    user.last_login_time = Date.now();
    user.save();
    // user.save().then((rec) => rec);
  },
  // Method to remove user entry from DB
  cleanUpEntries: (user, userActivation) => {
    console.log("USER ID ", user._id, " activation " + userActivation._id);
    User.findByIdAndDelete(user._id).exec();
    UserActivation.findByIdAndDelete(userActivation._id).exec();
  },
};
