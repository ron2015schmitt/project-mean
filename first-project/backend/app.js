const express = require('express');

const app = express();

// below is the function sequence that runs whenever a request is received from the front-end

app.use((req, res, next) => {
  // this is sent to server terminal output
    console.log(`${(new Date()).toLocaleString()}: Middleware Request protocol=${req.protocol} type=${req.method} host=${req.hostname} ip=${req.ip} url=${req.url}`);
    console.log(`                       path=${req.path} body=${req.body} params:`,req.params);
  // since we are not the final function call, we must call next
  next();
});

app.use((req, res, next) => {
  // this is the final function, which sends the message
  // this gets sent to the bropwser where it is displayed
  res.send('Hello from Express!');
  // the request/response sequence is complete
});

module.exports = app;
