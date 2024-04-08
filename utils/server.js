const express = require('express');
const createQueuesRouter = require('./queuesRouter');

const createServer = (initialQueue = []) => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', createQueuesRouter(initialQueue));
  return app;
}

module.exports = createServer;