const http = require('http');
const app = require('./src/app.js');
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
