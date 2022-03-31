'use strict';

const axios = require('axios');
const formatDate = require('./format_date');
const cache = require('./cache');

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
  try {
    const searchQuery = request.query.searchQuery;
    const lat = request.query.lat;
    const lon = request.query.lon;
    const key = `${lat}${lon}`;
    const url = `${process.env.WEATHER_API}?city=${searchQuery}&days=7&units=i&key=${process.env.WEATHER_API_KEY}`;
    if (cache[key] && Date.now() - cache[key].timeStamp < 50000) {
      console.log('Weather cache hit');
      response.send(cache[key].weatherCache);
    } else {
      const weather = await axios.get(url);
      if (weather) {
        const forecast = weather.data.data.map((day) => new Forecast(day));
        console.log('Weather cache miss');
        cache[key] = {
          weatherCache: forecast,
          timeStamp: Date.now(),
        };
        response.status(200).send(forecast);
      }
    }
  } catch (error) {
    response.send(error.message);
  }
}

module.exports = getWeather;
