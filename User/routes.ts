import * as express from 'express';
import * as controller from './controller';
import {User, IUserModel} from './model';
import * as jwt from 'express-jwt';

const passport = require('passport');
const router = express.Router();
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

router.get('/', controller.findAll);
router.get('/:email', controller.findOne);
router.put('/update/:email', controller.update);
router.put('/like/:id', auth, controller.like);

router.post('/login', controller.login);
router.post('/register', controller.register);

router.post('/forgot', controller.forgot);
router.post('/resetPassword/:token', controller.resetPassword);

router.get('/auth/facebook', passport.authenticate('facebook',{session: false, scope:['email']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
});

router.get('/auth/google', passport.authenticate('google',{session: false, scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
});

export = router;
