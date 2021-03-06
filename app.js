require('dnscache')({
  enable: true,
  ttl: 600,
  cachesize: 100,
});
const logger = require('timtam-logger');
const stringify = require('simple-stringify');

require('./helpers/local-require');


const config = localRequire('config');
const utils = localRequire('helpers/utils');

function initLogger() {
  logger.set({
    app: config.app,
    prefix: config.name,
  });
  logger.wrap(console);
  if (config.udpLog) {
    logger.add(config.udpLog);
  } else {
    logger.add('console');
  }
}

initLogger();

localRequire('helpers/bluebird');
localRequire('helpers/joi');
localRequire('models');


localRequire('helpers/server')(config.port);
localRequire('tasks');

function gracefulExit() {
  console.info('the application will be restart');
  utils.checkToExit(3);
}
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  gracefulExit();
});
process.on('uncaughtException', (err) => {
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  gracefulExit();
});

if (config.env !== 'development') {
  process.on('SIGTERM', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}

// set stringify mask
stringify.isSecret = key => key === 'password';
