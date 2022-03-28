'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const weatherData = require('./data/weather.json');
const app = express();
const PORT = process.env.PORT || 3002;
const axios = require('axios');

app.use(cors());

const months = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Credit to JJ for this formating function
const formatDate = (date) => {
  const dateArr = date.split('-');
  const year = dateArr[0];
  const month = findMonth(dateArr[1]);
  const day = dateArr[2];
  return `${month} ${day}, ${year}`;
};

const findMonth = (month) => {
  for (let i = 0; i < months.length + 1; i++) {
    if (i == month) {
      return months[i];
    }
  }
};

class Forecast {
  constructor(day) {
    this.date = formatDate(day.datetime);
    this.description = day.weather.description;
    this.lat = Math.round(day.lat);
    this.lon = Math.round(day.lon);
    this.high = Math.round(day.high_temp);
    this.low = Math.round(day.low_temp);
    this.rain = day.precip;
    this.windspd = Math.round(day.wind_spd);
    this.winddir = day.wind_cdir;
    this.icon = `/static/img/icons/${day.weather.icon}.png`;
  }
}

app.get('/weather', async (request, response) => {
  const searchQuery = request.query.searchQuery;
  const url = `${process.env.WEATHER_API}?city=${searchQuery}&lat=${this.lat}&lon=${this.lon}&days=7&units=i&key=${process.env.WEATHER_API_KEY}`;
  try {
    const weather = await axios.get(url);
    const forecast = weather.data.data.map((day) => new Forecast(day));
    response.status(200).send(forecast);
  } catch (error) {
    response.send(error.message);
  }
});

class Film {
  constructor(movie) {
    this.movieTitle = movie.original_title;
    this.overview = movie.overview;
    this.releaseDate = formatDate(movie.release_date);
    this.poster = movie.poster_path;
  }
}

app.get('/movies', async (request, response) => {
  const searchQuery = request.query.searchQuery;
  const url = `${process.env.MOVIE_API}?query=${searchQuery}&api_key=${process.env.MOVIE_API_KEY}&include_adult=false`;
  try {
    const movieData = await axios.get(url);
    const movieInfo = movieData.data.results.map((movie) => new Film(movie));
    response.status(200).send(movieInfo);
  } catch (error) {
    response.send(error.message);
  }
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
