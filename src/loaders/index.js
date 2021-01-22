const expressLoader = require('./express');
const sequelizeLoader = require('./sequelize');

module.exports = async (expressApp) => {
  const sequelizeConnection = await sequelizeLoader();

  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  expressLoader(expressApp);
};
