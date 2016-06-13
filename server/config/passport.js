var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt  = require('passport-jwt').ExtractJwt;
var User        = require('../models/user');
var config      = require('../config/main');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
  var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeader(),
    secretOrKey    : config.secret
  };

  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    User.findOne({id : jwtPayload.id}, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    });
  }));
};
