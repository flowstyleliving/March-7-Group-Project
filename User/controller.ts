import * as mongoose from 'mongoose';
import * as express from 'express';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as async from 'async';
import transport = require('nodemailer-smtp-transport');
import {User, IUserModel} from './model';

export function login(req: express.Request, res: express.Response, next: Function) {
  User.findOne({ email: req.body.email })
    .exec((err, user) => {
    if (err) return next(err);
    if (!user) return next({message: 'Invalid login.'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) return next({ message: 'Invalid login.' });
      else res.json({ token: user.generateJWT() });
    });
  });
}

export function register(req: express.Request, res: express.Response, next: Function) {
  let u = new User(req.body);
  u.hashPassword(req.body.password, (err, hash) => {
    if (err) return next(err);
    u.password = hash;
    User.create(u, (err, user: IUserModel) => {
      res.json({ token: user.generateJWT() });
    });
  });
}

export function forgot(req: express.Request, res: express.Response, next: Function) {
  User.findOne({email: req.body.email})
    .exec((err,user) => {
      if (err) return next(err);
      if (!user) return next({message: 'Invalid user'});
      if (user) {
        async.waterfall([
          function(cb) {
            crypto.randomBytes(20, (err, buf) => {
              let token = buf.toString('hex');
              cb(err, token);
            });
          }, function(token, cb) {
            user.resetPasswordToken = token;
            user.save((err) => {
              cb(err, token, user);
            });
          }, function(token, user: app.i.IUser, cb) {
            let smtpTransporter = nodemailer.createTransport(transport({
              service: 'Gmail',
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
              }
            }));
            let mailOptions = {
              from: 'Folio Team <folioteamcc@gmail.com>',
              to: user.email,
              subject: 'Folio Password Reset',
              text: 'Hey ' + user.name + ',\n\n' + 'We heard you forgot your password. Please click on the link below to reset it:\n\n' + 'http://localhost:3000/reset/' + token + '\n\n' + 'If you did not request a reset, please ignore this email. Your password will not be reset.\n\n' + 'Have a great day!\n\n' + 'xo,\n' + 'The Folio Team'
            };
            smtpTransporter.sendMail(mailOptions, (err) => {
              return res.redirect('/');
            })
          }], function(err) {
            if (err) return next(err);
            return res.redirect('/');
          })
      }
    });
    }

export function reset(req: express.Request, res: express.Response, next: Function) {
  User.findOne({resetPasswordToken: req.params.token}, (err, user) => {
    if (err) return next(err);
    if (!user) return next({message: 'Invalid or expired token'});
    if (user) {
      async.waterfall([
        function(cb) {
          // user.hashPassword(req.body.password, (err, hash) => {
          //   if (err) return next(err);
          //   user.password = hash;
          // });
          user.resetPasswordToken = undefined;
          user.save((err) => {
            res.json({token: user.generateJWT()});
            cb(err, user);
          });
        }, function(user: app.i.IUser, done) {
          let smtpTransporter = nodemailer.createTransport(transport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS
            }
          }));
          let mailOptions = {
            from: 'Folio Team <folioteamcc@gmail.com>',
            to: user.email,
            subject: 'Your Folio Password has been Reset',
            text: 'Password has been reset!'
          };
          smtpTransporter.sendMail(mailOptions, (err) => {
            return res.redirect('/');
          })
        }], function(err) {
          if (err) return next(err);
          return res.redirect('/');
        })
    }
  });
}

export function findAll(req: express.Request, res: express.Response, next: Function) {
        User.findOne({})
        .select('-password')
        .exec((err, data) => {
            if (err) return next (err);
            res.json(data);
        });
    }

export function findOne(req: express.Request, res: express.Response, next: Function) {
        User.findOne({_id: req.params.id})
        .select('-password')
        .populate('items', 'title images description datePosted dateComplete notes category')
        .exec((err, data) => {
            if (err) return next (err);
            res.json(data);
        });
    }

export function update (req: express.Request, res: express.Response, next: Function) {
        User.update({_id: req.params.id}, req.body,(err, numRows) => {
            if(err) return next(err);
            res.json({message: "Updated"});
        });
    }
