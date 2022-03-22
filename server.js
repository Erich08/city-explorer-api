'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', (request, response) => {
  const searchQuery = request.query.searchQuery;
  const city = weatherData.find(
    (cityObj) => cityObj.city_name.toLowerCase() === searchQuery.toLowerCase()
  );
  try {
    const forecast = city.data.map(
      (day) => new Forecast(day.valid_date, day.weather.description)
    );
    response.send(forecast);
  } catch (error) {
    response.send(error.message);
  }
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
