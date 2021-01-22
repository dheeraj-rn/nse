const { Router } = require('express');
const { celebrate } = require('celebrate');
const { validator } = require('../middlewares');
const authService = require('../../services/auth');

const route = Router();

module.exports = (app) => {
  app.use('/auth', route);

  route.post(
    "/signup",
    celebrate(validator.signup),
    async (req, res, next) => {
      try {
        const { username, password } = req.body;
        const authServiceInstance = new authService();
        const response = await authServiceInstance.signup(username, password);
        return res.json(response).status(200);
      } catch (err) {
        next(err);
      }
    }
  );
};
