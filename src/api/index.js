const { Router } = require('express');
const auth = require('./routes/auth.js');

module.exports = () => {
  const app = Router();
  auth(app);
  return app;
};
