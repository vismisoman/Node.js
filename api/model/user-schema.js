const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: false,
  },
  activated_date: {
    type: Date,
  },
  last_login_time: {
    type: Date,
  },
  last_logout_time: {
    type: Date,
  },
});

module.exports = mongoose.model("users-vs", UsersSchema);
