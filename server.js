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
const User = require("./models/user.js");

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

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  res.render("user/home.ejs", {user})
})

app.get("/users/:id/movie/new", async (req, res) => {
  const userId = req.params.id;

  res.render("movie/new.ejs", {userId})
})

app.post("/users/:id/movie", async (req, res) => {
  const userId = req.params.id;
  const { title, genre, runtime, director, yearOfRelease } = req.body;

  const user = await User.findById(userId);
  user.movies.push({ title, genre, runtime, director, yearOfRelease });

  await user.save();

  res.redirect(`/users/${userId}`);
});

app.get("/movies/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const userId = req.session.user._id;
  
  const user = await User.findById(userId);
  const movie = user.movies.id(movieId);
  
  res.render("movie/show.ejs", { movie, user });
});

app.get("/users/:userId/movie/:movieId/edit", async (req, res) => {
  const { userId, movieId } = req.params;

  try {
    const user = await User.findById(userId);
    const movie = user.movies.id(movieId);
    res.render("movie/edit.ejs", { movie, user });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

app.put("/users/:id/movie/:movieId", async (req, res) => {
  const userId = req.params.id;
  const movieId = req.params.movieId;
  const { title, genre, runtime, director, yearOfRelease } = req.body;

  const user = await User.findById(userId);
  const movie = user.movies.id(movieId);

  movie.title = title;
  movie.genre = genre;
  movie.runtime = runtime;
  movie.director = director;
  movie.yearOfRelease = yearOfRelease;

  await user.save();

  res.redirect(`/users/${userId}`);
});

app.delete("/users/:id/movie/:movieid", async (req, res) => {
  const userId = req.params.id;
  const movieId = req.params.movieid;

  const user = await User.findById(userId);
  user.movies.pull({ _id: movieId });  
  
  await user.save();

  res.redirect(`/users/${userId}`);
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});