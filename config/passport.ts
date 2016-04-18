let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth20').Strategy;
let GithubStrategy = require('passport-github').Strategy;

import { User } from '../User/model';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id','displayName','email'],
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next) {
  User.findOne({'facebook.id': profile.id})
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        req['tempUser'] = user;
        next(null, user);
      } else {
        let u = new User();
        u.name = profile.name;
        u.email = profile.email;
        u.facebook.id = profile.id;
        u.facebook.token = accessToken;
        u.save((err, user) => {
          if (err) return next(err);
          req['tempUser'] = user;
          next(null, user);
        });
      }
    });
}));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  passReqToCallback: true
}, function(req, token, tokenSecret, profile, next) {
  User.findOne({'twitterId': profile.id})
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        req['tempUser'] = user;
        next(null, user);
      } else {
        let u = new User();
        u.name = profile.displayName;
        u.twitter.id = profile.id;
        u.twitter.token = token;
        u.save((err, user) => {
          if (err) return next(err);
          req['tempUser'] = user;
          next(null, user);
        });
      }
    });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next) {
  User.findOne({'google.id': profile.id})
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        req['tempUser'] = user;
        next(null, user);
      } else {
        let u = new User();
        u.name = profile.displayName;
        u.email = profile.email;
        u.google.id = profile.id;
        u.google.token = accessToken;
        u.save((err, user) => {
          if (err) return next(err);
          req['tempUser'] = user;
          next(null, user);
        });
      }
    });
}));

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next){
  User.findOne({'githubId': profile.id})
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        req['tempUser'] = user;
        next(null, user);
      } else {
        let u = new User();
        u.name = profile.displayName;
        u.email = profile.email;
        u.github.id = profile.id;
        u.github.token = accessToken;
        u.save((err, user) => {
          if (err) return next(err);
          req['tempUser'] = user;
          next(null, user);
        });
      }
    });
}));

export = passport;
