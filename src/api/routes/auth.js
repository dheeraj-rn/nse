const { Router } = require('express');
const { Container } = require('typedi');
// const { celebrate } = require('celebrate');
// const { validator } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/auth', route);

  route.post(
    "/signup",
    // celebrate(validator.signup),
    async (req, res, next) => {
      try {
        const { username, password } = req.body;
        let AuthServiceInstance = Container.get('AuthServiceInstance');
        let response = await AuthServiceInstance.signup(username, password);
        return res.json(response).status(200);
      } catch (err) {
        return next(err);
      }
    }
  );
};
