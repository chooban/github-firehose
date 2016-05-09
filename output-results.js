'use strict';

const fs = require('fs');
const logger = require('./logger');
const zeroPad = require('./zero-pad.js');

const MAX_RECORDS = 1000;
const outputDir = process.cwd() + '/data/';
const baseFilename = outputDir + 'stored-events.json';
const rolledFile = /stored-events-\d+\.json/;

const rollFiles = () => {
  fs.readdir(outputDir, (err, files) => {
    files = files.filter((value) => (rolledFile.test(value)));

    if (files.length == 0) {
      logger.debug('No files, so writing the first one');
      fs.renameSync(baseFilename, outputDir + 'stored-events-0001.json');
    } else {
      logger.debug('Need to roll files');

      let numbers = files.map((value) => {
        logger.debug('Checking ' + value);
        return +value.match(/\d+/);
      }).sort((a, b) => (a - b));

      logger.debug(numbers);
      let rollingNumber = numbers.pop();
      logger.debug('Current max file number is ' + rollingNumber);

      if (rollingNumber == 499) {
        // Erm, a bit shit
        process.exit(1);
      }

      const fileName = outputDir + 'stored-events-' + zeroPad(++rollingNumber, 4) + '.json';
      fs.renameSync(baseFilename, fileName);
    }
  });
};

module.exports = (events) => {
  const writeEventsToFile = (err) => {
    let storedEvents = JSON.parse(fs.readFileSync(baseFilename, 'utf-8'));
    storedEvents = storedEvents.concat(events);
    fs.writeFileSync(baseFilename, JSON.stringify(storedEvents, null, 2));

    logger.log('debug', 'There are %j events logged', storedEvents.length);
    if (storedEvents.length > MAX_RECORDS) rollFiles();
  };

  const checkFileExists = (fileWriter) => {
    fs.stat('./data/stored-events.json', (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.writeFile(baseFilename, '[]', { encoding: 'utf-8' }, fileWriter);
        } else {
          logger.error(err);
          throw err;
        }
      } else {
        fileWriter();
      }
    });
  };

  checkFileExists(writeEventsToFile);
};
