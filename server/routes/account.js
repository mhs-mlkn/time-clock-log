var express    = require('express');
var jwt        = require('jsonwebtoken');
var User       = require('../models/user');
var mainConfig = require('../config/main');

module.exports = function () {
  var accountRouter = express.Router();

  accountRouter.route('/register')
    .post(register);

  accountRouter.route('/login')
    .post(login);

  accountRouter.route('/logout')
    .post(logout);

  return accountRouter;
};

function register (req, res) {
  if (!req.body.email || !req.body.password) {
    res.json(
      {
        success : false,
        message : 'Please enter email and password.'
      });
  }
  else {
    var newUser = new User({
      email    : req.body.email,
      password : req.body.password
    });

    // Attempt to save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({
          success : false,
          message : 'That email address already exists.',
          error   : err
        });
      }
      res.json({
        success : true,
        message : 'Successfully created new user.'
      });
    });
  }
}

function login (req, res) {
  User.findOne({
    email : req.body.email
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.send({
        success : false,
        message : 'Authentication failed. User not found.'
      });
    }
    else {
      // Check if password matches
      if (user.comparePassword(req.body.password)) {
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(user, mainConfig.secret, {
          expiresIn : 10800 // in seconds
        });
        res.json({
          success : true,
          token   : 'JWT ' + token
        });
      }
      else {
        res.send({
          success : false,
          message : 'Authentication failed. Passwords did not match.'
        });
      }
    }
  });
}

function logout (req, res) {

}
