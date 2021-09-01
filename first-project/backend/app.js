const express = require('express');
const bodyParser = require('body-parser');

// This will be a class with a constructor
const Post = require('./models/postDB');

const app = express();

app.use(bodyParser.json());

// give permissions for the front-end to access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// use hard-coded "database" for now
let posts = [
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

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  posts.push(post);
  console.log(`post received`,post);
  res.status(201).json({
    message: 'New post added successfully',
  });
});

// get the posts database
app.use('/api/posts', (req, res, next) => {
  // use hard-coded "database" for now
  // send status, then send posts as a JSON message!
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts
  });
});

module.exports = app;
