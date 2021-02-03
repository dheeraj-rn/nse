const { Container } = require('typedi');
const models = require('../models');
const AuthService = require('../services/auth');
const CommonService = require('../services/commons');
module.exports = () => {

  let db = Object.keys(models)
  db.forEach(el => {
    Container.set(el, models[el]);
  });

  Container.set('CommonServiceInstance', new CommonService());
  Container.set('AuthServiceInstance', new AuthService());
};
