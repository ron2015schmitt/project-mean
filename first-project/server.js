console.log('Node.js: My First MEAN App Server Started');

// load configuration
const config = require('./config.js');
console.log(`HOST=${config.HOST} NODE_ENV=${config.NODE_ENV}`);

// node.js requires
const debug = require("debug")("node-angular");
const http = require('http');

// get our ExpressJS application
const app = require('./backend/app');

// helper functions
const binder = (addr, port) => (typeof addr === "string") ? `pipe ${addr}` : `port ${port}`;

function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

// define function that sets the port number
const normalizePort = (val) => {
  let port = parseInt(val, 10);  // 10 forces radix 10

  if (isNaN(port)) {
    // named port
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;

}


// define error handler
// note closure variables: port
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = binder(null, port);

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated priviledges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      break;
  }
}

// define listener handler
// note closure variables: server, port
const onListening = () => {
  const addr = server.address();
  const bind = binder(addr, port);
  debug(`Listening on ${bind}`)
}


const port = normalizePort(config.PORT);
app.set('port', port);

// create and start the Node server using the Express app
const server = http.createServer(app);
server.on("error", onError);  // closure for error occurs here so includes port
server.on("listening", onListening); // closure for error occurs here so includes server and port
server.listen(port, config.HOST, () => {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`);
});

