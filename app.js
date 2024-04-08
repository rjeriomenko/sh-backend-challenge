const createServer = require('./utils/server');
const PORT = 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});