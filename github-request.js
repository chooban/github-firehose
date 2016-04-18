'use strict';

const request = require('request');

let options = {
  url: 'https://api.github.com/events',
  method: 'GET',
  headers: {
    'User-Agent': 'chooban',
    Accept: 'application/vnd.github.v3+json',
  },
};

module.exports = (authToken, done) => {
  options.headers.Authorization = 'token ' + authToken;
  request(options, done);
};
