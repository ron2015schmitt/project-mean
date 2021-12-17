const express = require('express');
const router = express.Router();

// This is the mongoose/mongoDB data model.  It is a class with a constructor
const User = require('../schemas/user');


// create a new post in the db
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash,        
            });
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'New user created successfully',
                result: result,
            });    
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            });
        });

});


module.exports = router;

