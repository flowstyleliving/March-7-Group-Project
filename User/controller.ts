import * as mongoose from 'mongoose';
import * as express from 'express';
import {User, IUserModel} from './model';

export function login(req: express.Request, res: express.Response, next: Function){
  if (!req.body.email) return next({message: 'Invalid login'});
  if (!req.body.password) return next({message: 'Invalid login/pass'});

  User.findOne({email: req.body.email})
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next({message: 'Invalid login combo'});
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) return next({message: 'Invalid login combo'});
        else res.json({token: generateJWT()});
      });
    });
}

export function register(req: express.Request, res: express.Response, next: Function){}
