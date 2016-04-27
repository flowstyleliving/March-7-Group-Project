import * as express from 'express';
import * as controller from './controller';
import {User, IUserModel} from './model';

const passport = require('passport');
const router = express.Router();

router.get('/', controller.findAll);
router.get('/:email', controller.findOne);
router.put('/update/:email', controller.update)

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
