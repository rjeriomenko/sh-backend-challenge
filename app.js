// REST API Endpoints are in routers/queuesRouter.js
// Unit tests are in __tests__/queuesRouter.test.js
// Start server with "npm start"
// Tests are run with "npm test"

const express = require('express');
const { createQueuesRouter } = require('./routers/queuesRouter');
const PORT = 3000;

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', createQueuesRouter());

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  return app;
}

// Creates application by starting server and
// applying router and middleware.
const main = () => {
  const app = createApp();
}

// Runs main only when app.js is executed with "npm start"
if (require.main === module) {
  main();
}

// createApp is exported for testing purposes.
module.exports = {
  createApp
};