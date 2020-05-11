const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Register a user
router.post('/register', (req, res, next) => {
  // Create a new user with the information that they subscribed
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    type: "r"
  });

  const username = req.body.username;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      // Add the user to the db
      User.addUser(newUser, (err, user) => {
        // Return the success state as false if it couldn't be registered
        if (err) {
          res.json({
            success: false,
            msg: err
          });
          // Return the success state as true if it could be registered
        } else {
          res.json({
            success: true,
            msg: 'User registred'
          });
        }
      });
    } else {
      return res.json({
        success: false,
        msg: 'That username is already taken'
      });
    }
  });
});

// Authenticate the user that we passed with the parameters
router.post('/authenticate', (req, res, next) => {
  // We just need to authenticate the username and the password
  const username = req.body.username;
  const password = req.body.password;

  // Get user by username and then compare the password
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: 'No user found'
      });
    }

    // Check if the password that we send is correct
    User.comparePassword(password, user.password, (err, isMatch) => {
      // Check some error
      if (err) throw err;

      // Check the password by encripting it and compare it with the one in the db
      if (isMatch) {
        /*const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });*/
        // Create a token that is going to be useful for one week
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });

        // Response of the success match returning the user, token and the success state ad true
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            type: user.type
          }
        });
        // If the authentication is wrong return the success state as false
      } else {
        return res.json({
          success: false,
          msg: 'Invalid Password'
        });
      }
    });
  });
});

// Profile, access to the data using the token that we generated and check if it still valid
router.get('/profile', passport.authenticate('jwt', {
  // if it is not valid return session as false
  session: false
}), (req, res, next) => {
  // if it is valid return the user
  res.json({
    // The req.user it has to be always like that is part of the passport library
    user: req.user
  });
});



router.get('/getAll', (req, res, next) => {
  User.getAll((err, savings) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        data: savings
      });
    }
  });
});

// Router module for make the petitions
module.exports = router;
