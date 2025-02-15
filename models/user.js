const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    runtime: {
      type: Number,
    },
    director: {
      type: String,
    },
    yearOfRelease: {
      type: Number,
    },
    watchedStatus: {
      type: Boolean, default: false
    }
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
  movies: [movieSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
