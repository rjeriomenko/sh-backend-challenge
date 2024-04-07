const express = require('express');
const app = express();
const queuesRouter = require('./queuesRouter');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use('/api/v1', queuesRouter);