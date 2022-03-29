'use strict';

const axios = require('axios');
const formatDate = require('./format_date');

class Film {
  constructor(movie) {
    this.movieTitle = movie.original_title;
    this.overview = movie.overview;
    this.releaseDate = formatDate(movie.release_date);
    this.poster = movie.poster_path;
  }
}

async function getMovies(request, response) {
  const searchQuery = request.query.searchQuery;
  const url = `${process.env.MOVIE_API}?query=${searchQuery}&api_key=${process.env.MOVIE_API_KEY}&include_adult=false`;
  try {
    const movieData = await axios.get(url);
    const movieInfo = movieData.data.results.map((movie) => new Film(movie));
    response.status(200).send(movieInfo);
  } catch (error) {
    response.send(error.message);
  }
}

module.exports = getMovies;
