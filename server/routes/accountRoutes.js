var express = require('express');
var User    = require('../models/user');

module.exports = function () {
  var accountRouter = express.Router();

  var accountController = require('../controllers/accountController')(User);

  accountRouter.route('/register')
    .post(accountController.register);

  accountRouter.route('/login')
    .post(accountController.login);

  return accountRouter;
};
