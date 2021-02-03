const expressLoader = require('./express');
const dependencyInjectorLoader = require('./dependencyInjector');

module.exports = async (expressApp) => {
  await dependencyInjectorLoader();
  expressLoader(expressApp);
};
