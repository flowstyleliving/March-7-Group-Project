import * as mongoose from 'mongoose';
import * as express from 'express';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import {User, IUserModel} from './model';


export function login(req: express.Request, res: express.Response, next: Function){
  if (!req.body.email) return req.flash('error', 'Invalid login combo.');
  if (!req.body.password) return req.flash('error', 'Invalid login combo.');

  User.findOne({email: req.body.email})
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return req.flash('error', 'Invalid login combo.');
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) return req.flash('error', 'Invalid login combo.');
        else res.json({token: user.generateJWT()});
      });
    });
}

export function register(req: express.Request, res: express.Response, next: Function){
  let u = new User(req.body);
  u.hashPassword(req.body.password, (err, hash) => {
    if (err) return next(err);
    u.password = hash;
    User.create(u, (err, user: IUserModel) => {
      res.json({token: user.generateJWT()});
    });
  });
}

export function forgot(req: express.Request, res: express.Response, next: Function) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    }, function (token, done) {
      User.findOne({email: req.body.email}, (err, user: app.i.IUser) => {
        if (!user) {
          req.flash('error', 'Looks like that account does not exist with Folio');
        }

        user.resetPasswordToken = token;
        user.resetPasswordDate = Date.now() + 3600000;

        User.save((err) => {
          done(err, token, user);
        });
      });
    }, function (token, user: app.i.IUser, done) {
      let smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'folioteamcc@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you have requested the reset of the password for your account.' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://localhost:3000/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('info','Password change request has been sent to ' + user.email + '.');
        done(err,'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}

export function reset(req: express.Request, res: express.Response, next: Function) {
  async.waterfall([
    function(done) {
      User.findOne({resetPasswordToken: req.params.token, resetPasswordDate:{$gt: Date.now()}}, (err,user:app.i.IUser) => {
        if (!user) {
          req.flash('error', 'Password reset link has expired or is invalid');
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordDate = undefined;

        User.save((err) => {
          req.login(user, (err) => {
            done(err, user);
          });
        });
      });
    }, function(user: app.i.IUser, done) {
      let smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'folioteamcc@gmail.com',
        subject: 'Password has been updated!',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been updated.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('Your password has been updated');
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}
