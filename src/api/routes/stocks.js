const { Router } = require('express');
const { Container } = require('typedi');

const route = Router();

module.exports = (app) => {
  app.use('/stocks', route);

  route.get(
    '/',
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
};
