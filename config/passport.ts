let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;

import { User } from '../User/model';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  done(err, user);
  });
});

export = passport;
