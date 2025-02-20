const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(methodOverride("_method"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/error", (req, res) => {
  res.render("error.ejs")
});

const authController = require("./controllers/auth.js");
app.use("/auth", authController);

const isSignedIn = require("./middleware/is-signed-in");
app.use(isSignedIn);

const userController = require("./controllers/user");
app.use("/users",  userController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});