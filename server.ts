require('dotenv').config({ silent: true });
import express = require('express');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import session = require('express-session');
import helmet = require('helmet');
let nodemailer = require('nodemailer');
import passport = require('./config/passport');

const app = express();

require('./Item/model');
require('./Comment/model');
require('./User/model');

let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/folio';
mongoose.connect(mongoUrl,(err) => {
  if (err) console.log(err);
  else console.log('Connected to ' + mongoUrl);
});

// view engine setup
app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

// View Route
app.use('/templates', require('./views/viewRoutes'));

app.use(session({secret: 'yoyo'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./ngApp'));
app.use('/scripts', express.static('bower_components'));


app.use('/api/v1/items', require ('./Item/routes'));
app.use('/api/v1/users', require('./User/routes'));
app.use('/api/v1/comments', require('./Comment/routes'));



app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  } else {
    return res.render('index');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers
app.use(function(err: any, req, res, next) {
  res.status(err.status || 500);
  // Don't leak stack trace if not in development
  let error = (app.get('env') === 'development') ? err : {};
  res.send({
    message: err.message,
    error: error
  });
});

export = app;
