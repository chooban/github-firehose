'use strict';

const fs = require('fs');
const logger = require('./logger');

module.exports = (events) => {
  let storedEvents = JSON.parse(fs.readFileSync('./stored-events.json', 'utf-8'));
  storedEvents = storedEvents.concat(events);
  fs.writeFileSync('./stored-events.json', JSON.stringify(storedEvents, null, 2));
  logger.log('info', 'There are %j events logged', storedEvents.length);
}
