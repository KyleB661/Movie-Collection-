const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    // properties of applications
  });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applications: [applicationSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
