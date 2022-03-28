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
    this.lat = day.lat;
    this.lon = day.lon;
  }
}

app.get('/weather', async (request, response) => {
  const searchQuery = request.query.searchQuery;
  const url = `${process.env.WEATHER_API}?city=${searchQuery}&lat=${this.lat}&lon=${this.lon}&days=7&key=${process.env.WEATHER_API_KEY}`;
  try {
    const weather = await axios.get(url);
    const forecast = weather.data.data.map((day) => new Forecast(day));
    response.status(200).send(forecast);
  } catch (error) {
    response.send(error.message);
  }
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
