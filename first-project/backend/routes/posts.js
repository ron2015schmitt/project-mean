const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const PostController = require('../controllers/posts');

// multer is set up to extract an image file from the field "image", if present
const multer = require("../middleware/multer");


// create a new post in the db
router.post(
    "",
    checkAuth,
    multer, // grabs field named "image"
    PostController.createPost,
);


// update a post given by id
// ':id' implies that id is sent in req.params not req.body
router.put('/:id', multer, checkAuth, PostController.updatePost);

// get the posts database
router.get('', PostController.getPosts );

// get a post given by id
// ':id' implies that id is sent in req.params not req.body
router.get('/:id', PostController.getPost );

// delete a post given by id
// ':id' implies that id is sent in req.params not req.body
router.delete("/:id", checkAuth, PostController.deletePost );

module.exports = router;
