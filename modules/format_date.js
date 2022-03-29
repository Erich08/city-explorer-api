'use strict';

const { builtinModules } = require('module');

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

module.exports = formatDate;
