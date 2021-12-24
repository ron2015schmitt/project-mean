const express = require('express');
const router = express.Router();

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const Post = require('../schemas/post');
const checkAuth = require("../middleware/check-auth");

// use multer for image transfers
const multer = require("multer");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});




// create a new post in the db
router.post(
    "",
    checkAuth,
    multer({ storage: storage }).single("image"),  // grabs field named "image"
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const imagePath = url + "/images/" + req.file.filename;
        console.log(`url=${url} imagePath=${imagePath}`);
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath,
            creator: req.userData.userId,
        });

        console.log(`posts.js: post request received route=${req.route.path}, post=`, post);
        console.log(req.body);
        post.save().then(result => {
            post.id = result._id;
            res.status(201).json({
                message: 'New post added successfully',
                post,
            });
        });
    });


// update a post given by id
// ':id' implies that id is sent in req.params not req.body
router.put(
    '/:id',
    multer({ storage: storage }).single("image"), // grabs field named "image"
    checkAuth,
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            // user submitted a new image file
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename;
        }
        console.log(`imagePath=${imagePath}`);
        const post = new Post({
            _id: req.params.id,
            title: req.body.title,
            content: req.body.content,
            creator: req.userData.userId,  // collect creator from userData, NOT body
            imagePath: imagePath,
        });
        console.log(`posts.js: put request received id=${req.params.id} route=${req.route.path}`, post);
        Post.updateOne({
            _id: req.params.id,
            creator: req.userData.userId
        }, post).then(result => {
            console.log(`posts.js: put /api/posts/:id: updated post on MongoDb `, result);
            if (result.matchedCount) {
                res.status(200).json({ message: 'Update Successful!', post });
            } else {
                res.status(401).json({ message: 'User not authorized for modifying this post!' });
            }
        })
    });

// get the posts database
router.get('', (req, res, next) => {
    // get the query paramaters
    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);
    let postQuery = Post.find();
    // here we filter down the results after we get all the posts form the db
    // for a large db we would want to do this differently
    if (pageSize && currentPage) {
        console.log(`pageSize=${pageSize} currentPage=${currentPage}`)
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    // retrieve exisiting posts from MongoDB
    let posts;
    postQuery.then(documents => {
        // the data items in MongoDB are called documents
        console.log(documents);
        posts = documents;
        return Post.count();
    }).then(count => {
        // retrieve is asynchronous, so we can't process until the callback gets called
        // send status, then send posts as a JSON message!
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts,
            count,
        });
    });
});

// get a post given by id
// ':id' implies that id is sent in req.params not req.body
router.get('/:id', (req, res, next) => {
    console.log(`posts.js: get request received id=${req.params.id} route=${req.route.path}`);
    Post.findById(req.params.id).then(post => {
        if (post) {
            console.log(`posts.js: get from MongoDb `, post);
            res.status(200).json({
                message: 'Post fetched successfully!',
                post,
            });
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
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId,  // collect creator from userData, NOT body
    }).then(result => {
        console.log(result);
        if (result.deletedCount) {
            res.status(200).json({ message: "Post deleted!" });
        } else {
            res.status(401).json({ message: 'User not authorized to delete this post!' });
        }
    });
});


module.exports = router;
