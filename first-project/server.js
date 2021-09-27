// for pretty logs
const chalk = require('chalk');

console.log('');

// load configuration
const config = require('./config.js');

// console.log('Node.js: '+chalk.green(config.NAME)+' Server Started');
// console.log(`config: HOST=`+chalk.green(config.HOST)+` NODE_ENV=`+chalk.green(config.NODE_ENV)+` PORT=`+chalk.green(config.PORT));

// node.js requires
const debug = require("debug")("node-angular");
const http = require('http');

// get our ExpressJS application
const app = require('./app');

// ---------------------------------------------------------------
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
      console.error(chalk.red(`${bind} requires elevated privileges`));
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(chalk.red(`${bind} is already in use`));
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


// ---------------------------------------------------------------

const port = normalizePort(config.PORT);
app.set('port', port);


// create and start the server using the Express app
const server = http.createServer(app);
server.on("error", onError);  // closure for error occurs here so includes port
server.on("listening", onListening); // closure for error occurs here so includes server and port
server.listen(port, config.HOST, () => {
  console.log(`App listening on `+chalk.green(`http://${config.HOST}:${port}`));
});

