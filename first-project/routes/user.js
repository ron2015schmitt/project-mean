const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const User = require('../schemas/user');
const secret = require('../middleware/secret');


// create a new user in the db
router.post('/signup', (req, res, next) => {
    console.log(`user.js: signup request received route=${req.route.path}`);
    console.log(req.body);

    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'New user created successfully',
                result: result,
            });
        }).catch(err => {
            res.status(500).json({
                error: err,
            });
        });
    });

});

router.post('/login', (req, res, next) => {
    console.log(`user.js: login request received route=${req.route.path}`);
    let user = null;
    User.findOne({ email: req.body.email }).then(usr => {
        if (!usr) {
            console.log(`user.js: login request user not found`, usr);
            return res.status(401).json({
                message: "Auth failed",
            });
        }
        user = usr;
        console.log(`user.js: user found: `, usr.email);
        const promise = bcrypt.compare(req.body.password, user.password);
        return promise;
    }).then(result => {
        if (!result) {
            console.log(`user.js: user password is incorrect`,result);
            res.status(401).json({
                message: "Auth failed",
            });
        }
        console.log(`user.js: login succeeded:`, result);
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            secret,
            { expiresIn: '1h' },
        );
        console.log(`user.js: got token:`, token);
        res.status(200).json({
            token,
        });
    }).catch(err => {
        console.log(`user.js: user login failed`, err);
        res.status(401).json({
            message: "Auth failed",
        });
    });
});

module.exports = router;

