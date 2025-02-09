const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }  
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Passwords must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = User.create({
      username: req.body.username,
      password: hashedPassword,
    })
    res.redirect("/auth/sign-in")
  });
  
  router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
  });
  
  router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
    return res.send("Login failed.");
  }
    const correctPassword = bcrypt.compareSync(req.body.password,userInDatabase.password);
    if (!correctPassword) {
    return res.send("Login failed.");
  }
  
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  
    res.redirect("/");
  });

  router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
  
  
  module.exports = router;