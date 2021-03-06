const { Router } = require('express');
const { Container } = require('typedi');
const { validator } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    validator.auth,
    async (req, res, next) => {
      try {
        const { username, password } = req.body;
        const AuthServiceInstance = Container.get('AuthServiceInstance');
        const response = await AuthServiceInstance.signup(username, password);
        return res.json(response).status(200);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.post(
    '/login',
    validator.auth,
    async (req, res, next) => {
      try {
        const { username, password } = req.body;
        const AuthServiceInstance = Container.get('AuthServiceInstance');
        const response = await AuthServiceInstance.login(username, password);
        return res.json(response).status(200);
      } catch (error) {
        return next(error);
      }
    },
  );
};
