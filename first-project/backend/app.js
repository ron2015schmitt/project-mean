
// for pretty logs
const chalk = require('chalk');



// ---- Mongoose ----
const mongoose = require('mongoose');

// read password from bach environment
const dotenv = require('dotenv').config();
let password = process.env.MONGODB_PASSWORD;
// console.log(`password: typeof=${typeof password}`, password);


if (!password) {
  console.error(`app.js: `+chalk.red.bold(`MONGODB_PASSWORD NOT provided`)+` (typeof password=${typeof password})`);
  console.log(  `        You must type '`+chalk.magenta(`export MONGODB_PASSWORD=my-password`)+`' before running.`);
  process.exit(1);
} else {
  console.log(`app.js: MONGODB_PASSWORD found! typeof=${typeof password}`);
}

main().catch(err => {
  console.log(`app.js: Connection to MongoDB failed.`);
  console.log(err);
});

async function main() {
  await mongoose.connect(`mongodb+srv://main:${password}@cluster0.ukfax.mongodb.net/mean-course?retryWrites=true&w=majority`);
}

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const Post = require('./models/postDB');



// ---- express app ----

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { config } = require('dotenv');
const { exit } = require('process');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (config.INTEGRATE_ANGULAR) {
  // we need to serve up angular (URL with out any suffix)
  const angDir = path.join("angular");
  console.log(`config.js: serving Angular from ${angDir}`);
  app.use('/', express.static(angDir));
  app.set('view engine', 'pug');
}

// give permissions for the front-end to access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// create a new post in the db
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  console.log(`app.js: post request received route=${req.route.path}`, post);
  post.save().then(result => {
    res.status(201).json({
      message: 'New post added successfully',
      id: result._id,
    });
  });
});

// update a post given by id
// ':id' implies that id is sent in req.params not req.body
app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  console.log(`app.js: put request received id=${req.params.id} route=${req.route.path}`, post);
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(`app.js: put /api/posts/:id: updated post on MongoDb `, result);
    res.status(200).json({ message: 'Update Sucessful!' });
  })
});

// get the posts database
app.get('/api/posts', (req, res, next) => {
  // retrieve exisiting posts from MongoDB
  Post.find().then(documents => {
    // the data items in MongoDB are called documents
    console.log(documents);
    // retrieve is asynchronous, so we can't process until the callback gets called
    // send status, then send posts as a JSON message!
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents,
    });
  });
});

// delete a post given by id
// ':id' implies that id is sent in req.params not req.body
app.delete("/api/posts/:id", (req, res, next) => {
  console.log(`app.js: delete request received id=${req.params.id}`);
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      // console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
});


if (config.INTEGRATE_ANGULAR) {
  app.use('/api/posts', (req, res, next) => {
    const angIndex = path.join(__dirname, "angular", "index.html");
    console.log(`config.js: sending Angular FE: ${angIndex}`);
    res.sendFile(angIndex);
  });
}

module.exports = app;
