const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/error", (req, res) => {
  res.render("error.ejs")
});

app.use("/auth", authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});