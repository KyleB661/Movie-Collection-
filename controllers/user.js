const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
  
    res.render("user/home.ejs", {user})
  })
  
  router.get("/:id/movie/new", async (req, res) => {
    const userId = req.params.id;
  
    res.render("movie/new.ejs", {userId})
  })

  router.post("/:id/movie", async (req, res) => {
    const userId = req.params.id;
    const { title, genre, runtime, director, yearOfRelease } = req.body;
  
    const user = await User.findById(userId);
    user.movies.push({ title, genre, runtime, director, yearOfRelease });
  
    await user.save();
  
    res.redirect(`/users/${userId}`);
  });

  router.get("/:userId/movie/:movieId", async (req, res) => {
    try {
      const { userId, movieId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.redirect("/error");
      }
  
      const movie = user.movies.id(movieId);
      if (!movie) {
        return res.redirect("/error");
      }
  
      res.render("movie/show.ejs", { movie, user });
    } catch (err) {
      console.error(err);
      res.redirect("/error");
    }
  });
  
  router.get("/:userId/movie/:movieId/edit", async (req, res) => {
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
  
  router.put("/:id/movie/:movieId", async (req, res) => {
    const userId = req.params.id;
    const movieId = req.params.movieId;
    const { title, genre, runtime, director, yearOfRelease, watchedStatus } = req.body;
  
    const user = await User.findById(userId);
    const movie = user.movies.id(movieId);
  
    movie.title = title;
    movie.genre = genre;
    movie.runtime = runtime;
    movie.director = director;
    movie.yearOfRelease = yearOfRelease;
    movie.watchedStatus = watchedStatus === "on";
  
    await user.save();
  
    res.redirect(`/users/${userId}`);
  });
  
  router.put("/:id/movie/:movieId/watched", async (req, res) => {
    try {
      const { id: userId, movieId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) return res.redirect("/error");
  
      const movie = user.movies.id(movieId);
      if (!movie) return res.redirect("/error");
  
      movie.watchedStatus = !movie.watchedStatus;
      await user.save();
  
      res.redirect(`/users/${userId}`);
    } catch (err) {
      console.error(err);
      res.redirect("/error");
    }
  });
  
  router.delete("/:id/movie/:movieId", async (req, res) => {
    const userId = req.params.id;
    const movieId = req.params.movieId;
  
    const user = await User.findById(userId);
    user.movies.pull({ _id: movieId });  
  
    await user.save();
  
    res.redirect(`/users/${userId}`);
  });
  
module.exports = router;