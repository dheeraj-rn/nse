const uitl = require('util');
const redis = require('redis');
const config = require('../config');

module.exports = () => {
  const client = redis.createClient(config.env.redis);
  client.get = uitl.promisify(client.get);
  return client;
};
