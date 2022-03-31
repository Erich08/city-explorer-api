'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;
const getWeather = require('./modules/weather_data');
const getMovies = require('./modules/movie_data');

app.use(cors());

app.get('/movies', getMovies);

app.get('/weather', getWeather);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
