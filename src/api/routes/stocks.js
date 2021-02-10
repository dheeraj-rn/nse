const { Router } = require('express');
const { Container } = require('typedi');
const { AuthValidator } = require('../middlewares');

const route = Router();

module.exports = (app) => {
  app.use('/stocks', route);

  route.get(
    '/',
    AuthValidator.verifyToken,
    async (req, res, next) => {
      try {
        const StockServiceInstance = Container.get('StockServiceInstance');
        const response = await StockServiceInstance.getall();
        return res.json(response).status(200);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.get(
    '/search/:searchTerm',
    AuthValidator.verifyToken,
    async (req, res, next) => {
      try {
        const { searchTerm } = req.params;
        const StockServiceInstance = Container.get('StockServiceInstance');
        const response = await StockServiceInstance.search(searchTerm);
        return res.json(response).status(200);
      } catch (err) {
        return next(err);
      }
    },
  );
};
