const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// read password from bach environment
require('dotenv').config();
let password = process.env.MONGODB_PASSWORD;
// console.log(`password: typeof=${typeof password}`, password);

main().catch(err => {
  console.log(`Connection to MongoDB failed.`);
  console.log(err);
});

async function main() {
  await mongoose.connect(`mongodb+srv://main:${password}@cluster0.ukfax.mongodb.net/mean-course?retryWrites=true&w=majority`);
}


// This is the mongoose/mongoDB data model.  It is a class with a constructor
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


app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  post.save();
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
    posts: [],
  });
});

module.exports = app;
