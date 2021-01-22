const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("Couldn't find .env file");
}

module.exports = {

  port: parseInt(PORT, 10),
  api: {
    prefix: '/api',
  },
  pg_url: process.env.PG_URL
};
