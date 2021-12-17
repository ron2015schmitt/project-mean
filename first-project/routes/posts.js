const express = require('express');
const router = express.Router();

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const Post = require('../schemas/post');
const checkAuth = require("../middleware/check-auth");


// create a new post in the db
router.post('', checkAuth, (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    })
    console.log(`posts.js: post request received route=${req.route.path}`, post);
    console.log(req.body);
    post.save().then(result => {
        res.status(201).json({
            message: 'New post added successfully',
            id: result._id,
        });
    });
});

// update a post given by id
// ':id' implies that id is sent in req.params not req.body
router.put('/:id', checkAuth, (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
    });
    console.log(`posts.js: put request received id=${req.params.id} route=${req.route.path}`, post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(`posts.js: put /api/posts/:id: updated post on MongoDb `, result);
        res.status(200).json({ message: 'Update Sucessful!' });
    })
});

// get the posts database
router.get('', (req, res, next) => {
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

// update a post given by id
// ':id' implies that id is sent in req.params not req.body
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: 'Post not found!',
            });
        }
    });
});

// delete a post given by id
// ':id' implies that id is sent in req.params not req.body
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log(`posts.js: delete request received id=${req.params.id}`);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            // console.log(result);
            res.status(200).json({ message: "Post deleted!" });
        });
});


module.exports = router;

