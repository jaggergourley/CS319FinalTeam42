// backend/index.js
// This is the main server file where we set up our RESTful API endpoints to interact with the Movie database.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Movie = require("./models/Movie"); // Model for interfacing with the movie data in MongoDB

const app = express();

app.use(cors()); // Enable CORS for all routes so that the API is accessible from a different domain
app.use(express.json()); // Middleware to parse incoming JSON payloads in request bodies

// Connect to MongoDB at the specified URI
mongoose.connect("mongodb://127.0.0.1:27017/team42db", {});

// Define an endpoint to retrieve all movies with optional sorting
app.get("/movies", async (req, res) => {
  try {
    let query = Movie.find(); // Start with a query to find all movies

    // Filtering based on query parameters
    // Filtering for title
    if (req.query.title) {
      query = query.where("title").equals(new RegExp(req.query.title, "i"));
    }

    // Filtering for director
    if (req.query.director) {
      query = query
        .where("director")
        .equals(new RegExp(req.query.director, "i"));
    }

    // Filtering for actors
    if (req.query.actor) {
      // Regular expression to search for the actor's name in the comma-separated list
      const actorRegex = new RegExp(req.query.actor.split(" ").join("|"), "i");
      query = query.where("actors").regex(actorRegex);
    }

    // Filtering for genre
    if (req.query.genre) {
      const genreRegex = new RegExp(req.query.genre, "i"); // Case-insensitive regex
      query = query.where("genre").regex(genreRegex);
    }

    // Check if sorting parameters are provided in the request
    if (req.query.sortBy && req.query.order) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === "desc" ? -1 : 1; // Use -1 for descending order, 1 for ascending
      query = query.sort({ [sortField]: sortOrder }); // Apply sorting to the query
    }

    const movies = await query.exec();
    res.json(movies); // Send the resulting list of movies
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Define an endpoint to create a new movie
app.post("/movies", async (req, res) => {
  const movie = new Movie(req.body); // Create a new movie from the request body
  try {
    const savedMovie = await movie.save(); // Save the new movie to the database
    res.status(201).json(savedMovie); // Respond with the saved movie
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Define an endpoint to update an existing movie by ID
app.put("/movies/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document instead of the original
    );
    if (!updatedMovie) {
      return res.status(404).send("Movie not found."); // If no movie is found for update, return 404
    }
    res.json(updatedMovie); // Send the updated movie
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Define an endpoint to delete a movie by ID
app.delete("/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).send("Movie not found."); // If no movie is found for deletion, return 404
    }
    res.json({ message: "Movie successfully deleted", deletedMovie }); // Confirm deletion
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
