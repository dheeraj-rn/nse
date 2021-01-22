const express = require('express');
const config = require('./config');
const loader = require('./loaders');

async function startServer() {
  const app = express();
  loader(app);

  app.listen(config.port, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`listening to http://127.0.0.1:${config.port}`);
  });
}

startServer();
