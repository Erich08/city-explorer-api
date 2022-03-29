'use strict';

const axios = require('axios');
const formatDate = require('./format_date');

class Forecast {
  constructor(day) {
    this.date = formatDate(day.datetime);
    this.description = day.weather.description;
    this.high = Math.round(day.high_temp);
    this.low = Math.round(day.low_temp);
    this.rain = day.precip;
    this.windspd = Math.round(day.wind_spd);
    this.winddir = day.wind_cdir;
    this.icon = `/static/img/icons/${day.weather.icon}.png`;
  }
}

async function getWeather(request, response) {
  const searchQuery = request.query.searchQuery;
  const url = `${process.env.WEATHER_API}?city=${searchQuery}&days=7&units=i&key=${process.env.WEATHER_API_KEY}`;
  try {
    const weather = await axios.get(url);
    const forecast = weather.data.data.map((day) => new Forecast(day));
    response.status(200).send(forecast);
  } catch (error) {
    response.send(error.message);
  }
}

module.exports = getWeather;
