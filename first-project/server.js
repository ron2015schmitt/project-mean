console.log('My First App Node Server Started');

const http = require('http');

// get our ExpressJS application
const app = require('./backend/app');
// set the port number
const port = process.env.PORT || 3000;
app.set('port', port);

// create and start the Node server using the Express app
const server = http.createServer(app);
server.listen(port);

