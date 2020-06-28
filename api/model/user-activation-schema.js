const mongoose = require("mongoose");

const UserActivationSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  activation_code: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users-activation", UserActivationSchema);
