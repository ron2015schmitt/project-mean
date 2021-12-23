
const path = require('path');

// for pretty logs
const chalk = require('chalk');

// load config
const config = require('./config.js');
// console.log(`app.js: config.INTEGRATE_ANGULAR=${config.INTEGRATE_ANGULAR}`);

// ---- Mongoose ----
const mongoose = require('mongoose');

// read password from bach environment
let password = process.env.MONGODB_PASSWORD;

if (!password) {
  console.error(`app.js: ` + chalk.red.bold(`MONGODB_PASSWORD NOT provided`) + ` (typeof password=${typeof password})`);
  console.log(`        You must type '` + chalk.magenta(`export MONGODB_PASSWORD=my-password`) + `' before running.`);
  process.exit(1);
} else {
  console.log(`app.js: MONGODB_PASSWORD found! typeof=${typeof password}`);
}

main().catch(err => {
  console.log(`app.js: Connection to MongoDB failed.`);
  console.log(err);
  process.exit(1);
});

async function main() {
  await mongoose.connect(`mongodb+srv://main:${password}@cluster0.ukfax.mongodb.net/mean-course?retryWrites=true&w=majority`);
  // await mongoose.connect(`mongodb+srv://main:${password}@cluster0.ukfax.mongodb.net/mean-course`);
}




// ---- express app ----

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { exit } = require('process');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (config.INTEGRATE_ANGULAR) {
  // we need to serve up angular (URL with out any suffix)
  const angDir = path.join("dist/integrated");
  console.log(`config.js: serving Angular from ${angDir}`);
  app.use('/', express.static(angDir));
  app.set('view engine', 'pug');
}

// give permissions for the front-end to access
app.use((req, res, next) => {
  console.log(`app.js: permissions request received`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, UPDATE"
  );
  next();
});

if (config.INTEGRATE_ANGULAR) {
  app.use('/api/posts', (req, res, next) => {
      const angIndex = path.join(__dirname, "angular", "index.html");
      console.log(`config.js: sending Angular FE: ${angIndex}`);
      res.sendFile(angIndex);
  });
}


// for retrieivng images in the backend/images folder
app.use("/images", express.static(path.join("backend/images")));


// routes
const postsRoutes = require('./routes/posts');
app.use("/api/posts", postsRoutes);

const userRoutes = require('./routes/user');
app.use("/api/user", userRoutes);

module.exports = app;
