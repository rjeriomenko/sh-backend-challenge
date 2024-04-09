const express = require('express');
const queuesRouter = require('./queuesRouter');

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', queuesRouter.createQueuesRouter());
  return app;
}

module.exports = createServer;