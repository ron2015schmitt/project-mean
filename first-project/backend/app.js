const express = require('express');
const app = express();

app.use('/api/posts', (req, res, next) => {
  // use hard-coded "database" for now
  const posts = [
    {
      id: "fa12823",
      title: "First Server-side post",
      content: "This is coming from the server!",
    },
    {
      id: "rs23981",
      title: "Second Server-side post",
      content: "This is also coming from the server!",
    },
  ];
  // send status, then send posts as a JSON message!
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts
  });
});

module.exports = app;
