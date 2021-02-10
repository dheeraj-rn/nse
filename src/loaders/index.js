const expressLoader = require('./express');
const dependencyInjectorLoader = require('./dependencyInjector');
const CronJob = require('./jobs');

module.exports = async (expressApp) => {
  await dependencyInjectorLoader();
  expressLoader(expressApp);
  await CronJob();
};
