const { Router } = require('express');
const auth = require('./routes/auth');
const stocks = require('./routes/stocks');

module.exports = () => {
  const app = Router();
  auth(app);
  stocks(app);
  return app;
};
