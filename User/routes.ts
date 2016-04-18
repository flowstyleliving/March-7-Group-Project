import * as express from 'express';
import * as controller from './controller';

const passport = require('passport');
const router = express.Router();

router.post('/login',controller.login);
router.post('/register',controller.register);

router.get('/forgot',controller.forgot);
router.get('/reset/:token',controller.reset);
router.post('/reset/:token',controller.reset);

export = router;
