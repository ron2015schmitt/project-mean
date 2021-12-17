const express = require('express');
const router = express.Router();

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const Post = require('../schemas/signup');


// create a new post in the db
router.post('/signup', (req, res, next) => {
});


module.exports = router;

