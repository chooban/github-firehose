'use strict';

const fs = require('fs');
const logger = require('./logger');
const request = require('./github-request');
const config = require('./.config.json');
const writeResultsToFile = require('./output-results.js');

const responseHandler = (err, resp, body) => {
    if (err) {
      logger.error('Error!', err);
      process.exit(1);
    }

    let content = JSON.parse(body);

    if (content.length) {
      writeResultsToFile(content);
    } else {
      logger.info("No content. Might be some information in the headers");
      logger.info(resp.headers);
    }

    if (+resp.headers["x-ratelimit-remaining"]) {
      logger.log('info', 'Remaining requests before limit hit: %j', +resp.headers["x-ratelimit-remaining"])
      setTimeout(makeRequest, 1000);
    }
};

const makeRequest = () => {
  request(config.authToken, responseHandler);
}

process.on('SIGINT', () => {
  process.exit(0);
});

makeRequest()
