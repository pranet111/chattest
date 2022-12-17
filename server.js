const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handleRequest);

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
