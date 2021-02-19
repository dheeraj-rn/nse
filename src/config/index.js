const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("Couldn't find .env file");
}
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

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
      port: process.env.DB_PORT,
    },
    production: {
      use_env_variable: process.env.DATABASE_URL,
      dialect: process.env.DB_DIALECT,
      protocol: process.env.DB_DIALECT,
      dialectOptions: {
        ssl: true,
        rejectUnauthorized: false,
      },
    },
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    redis: process.env.REDIS_TLS_URL,
  },
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_PORT,
  },
};
