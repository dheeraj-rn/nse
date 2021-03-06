const { Container } = require('typedi');
const models = require('../models');
const AuthService = require('../services/auth');
const CommonService = require('../services/commons');
const TokenService = require('../services/token');
const NseService = require('../services/nse');
const StockService = require('../services/stocks');
const Redis = require('./redis');
const config = require('../config');

module.exports = () => {
  const db = Object.keys(models);
  db.forEach((el) => {
    Container.set(el, models[el]);
  });

  Container.set('AxiosProxy', config.proxy);
  Container.set('RedisClient', Redis());
  Container.set('TokenServiceInstance', new TokenService());
  Container.set('CommonServiceInstance', new CommonService());
  Container.set('AuthServiceInstance', new AuthService());
  Container.set('NseServiceInstance', new NseService());
  Container.set('StockServiceInstance', new StockService());
};
