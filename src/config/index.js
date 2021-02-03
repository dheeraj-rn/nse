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
  db: {
    development: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT
    }
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET
  }
};
