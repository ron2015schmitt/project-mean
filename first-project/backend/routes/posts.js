const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const PostController = require('../controllers/posts');

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
    PostController.createPost,
);


// update a post given by id
// ':id' implies that id is sent in req.params not req.body
router.put(
    '/:id',
    multer({ storage: storage }).single("image"), // grabs field named "image"
    checkAuth,
    PostController.updatePost,
);

// get the posts database
router.get('', PostController.getPosts );

// get a post given by id
// ':id' implies that id is sent in req.params not req.body
router.get('/:id', PostController.getPost );

// delete a post given by id
// ':id' implies that id is sent in req.params not req.body
router.delete("/:id", checkAuth, PostController.deletePost );

module.exports = router;
