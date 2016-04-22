import * as express from 'express';
import * as controller from './controller';
import {User, IUserModel} from './model';


const passport = require('passport');
const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/update/:id', controller.update)

router.post('/login', controller.login);
router.post('/register', controller.register);

router.post('/forgot', controller.forgot);

router.get('/reset/:token', (req, res, next) => {
  User.findOne({resetPasswordToken: req.params.token} , (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/forgot');
    }
      res.render('Reset', {
        user: req.user
      });
  });
});

router.post('/reset/:token', controller.reset);


router.get('/auth/facebook', passport.authenticate('facebook',{session: false}));
router.get('/auth/facebook/callback', passport.authenticate('facebook',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
});

router.get('/auth/twitter', passport.authenticate('twitter',{session: false}));
router.get('/auth/twitter/callback', passport.authenticate('twitter',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
});

router.get('/auth/google', passport.authenticate('google',{session: false, scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
});

router.get('/auth/github', passport.authenticate('github',{session: false}));
router.get('/auth/github/callback', passport.authenticate('github',{session: false}), (req,res,next) => {
  res.redirect('/?code=' + req['tempUser'].generateJWT());
})

export = router;
