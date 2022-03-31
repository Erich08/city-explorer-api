'use strict';

const axios = require('axios');
const formatDate = require('./format_date');
const cache = require('./cache');

class Film {
  constructor(movie) {
    this.movieTitle = movie.original_title;
    this.overview = movie.overview;
    this.releaseDate = formatDate(movie.release_date);
    this.poster = movie.poster_path;
  }
}

async function getMovies(request, response) {
  try {
    const searchQuery = request.query.searchQuery;
    const url = `${process.env.MOVIE_API}?query=${searchQuery}&api_key=${process.env.MOVIE_API_KEY}&include_adult=false`;

    if (
      cache[`${searchQuery}`] &&
      Date.now() - cache[`${searchQuery}`].timeStamp < 50000
    ) {
      console.log('Movie cache hit');
      response.send(cache[`${searchQuery}`].movieCache);
    } else {
      const movieData = await axios.get(url);
      if (movieData) {
        const movieInfo = movieData.data.results.map(
          (movie) => new Film(movie)
        );
        console.log('Movie cache miss');
        cache[`${searchQuery}`] = {
          movieCache: movieInfo,
          timeStamp: Date.now(),
        };
        response.status(200).send(movieInfo);
      }
    }
  } catch (error) {
    response.send(error.message);
  }
}

module.exports = getMovies;
