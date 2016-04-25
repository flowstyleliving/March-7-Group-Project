import * as mongoose from 'mongoose';
import * as express from 'express';
import * as crypto from 'crypto';
import * as async from 'async';
import {User, IUserModel} from './model';
import {Item, IItemModel} from '../Item/model';

let nodemailer = require('nodemailer');
let transport = require('nodemailer-smtp-transport');

export function login(req: express.Request, res: express.Response, next: Function) {
    User.findOne({ email: req.body.email })
        .exec((err, user) => {
        if (err) return next(err);
        if (!user) return next({ message: 'Invalid login.' });
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
    User.findOne({ email: req.body.email })
        .exec((err, user) => {
        if (err) return next(err);
        if (!user) return next({ message: 'Invalid user' });
        if (user) {
            async.waterfall([
                function(cb) {
                    crypto.randomBytes(5, (err, buf) => {
                        let token = buf.toString('hex');
                        cb(err, token);
                    });
                }, function(token, cb) {
                    user.resetPasswordToken = token;
                    user.resetPasswordToken = user.resetPasswordToken.trim.toString();
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
                        html: 'Hey ' + user.name + ',<br>' + 'We heard you forgot your password. There are 2 steps to reset:<br>' + '1) Here is your reset token. It expires within an hour from when you requested to reset your password: ' + '<strong>' + token + '</strong><br><br>' + '2) Click on the link below to reset<br>' + 'http://localhost:3000/reset/<br><br>' + 'If you did not request a reset, please ignore this email. Your password will not be reset.<br><br>' + 'Have a great day!<br><br>' + 'xo,<br>' + 'The Folio Team'
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

export function checkToken(req: express.Request, res: express.Response, next: Function) {
  User.findOne({ resetPasswordToken: req.body.token })
        .exec((err, token) => {
        if (err) return next(err);
        if (!token) {
          return next({ message: 'Invalid token.' });
        }
        if (token) return res.redirect('/');
    });
}

export function findAll(req: express.Request, res: express.Response, next: Function) {
    User.find({})
        .select('-password -facebook')
        .exec((err, data) => {
        if (err) return next(err);
        res.json(data);
    });
}


export function findOne(req: express.Request, res: express.Response, next: Function) {
    User.findOne({ _id: req.params.id })
        .select('-password -facebook')
        .populate('items', 'title images description datePosted dateComplete notes category')
        .exec((err, data) => {
        if (err) return next(err);
        Item.populate(data.items, { path: 'user', select: 'name', model: 'User' }, (err, response) => {
            if (err) return next(err);
            res.json(data);
        });
    });
}

export function update(req: express.Request, res: express.Response, next: Function) {
    User.update({ _id: req.params.id }, req.body, (err, numRows) => {
        if (err) return next(err);
        res.json({ message: "Updated" });
    });
}
