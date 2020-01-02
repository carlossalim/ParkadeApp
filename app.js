let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let pug = require('pug');
let flash = require('connect-flash');

let passport = require('passport');
let session = require("express-session");

require('./passport_setup')(passport);

//Sequelize
db = require('./config/database');

//TESTING DB CONNECTION
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//DEFINE MODELS
// const Parkade = require('./models/Parkade');
// const User = require('./models/User');
// const Unit = require('./models/Unit');

//DEFINE ROUTES
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let signupRouter = require('./routes/signup');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(flash()); //Connect Flash
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//INITIALIZE PASSPORT & SESSION
app.use(session({
  secret: 'catmovies',
  resave: true,
  saveUninitialized: true
}));

//Set Flash messages to global variables  
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.myuser = req.flash('user');
  res.locals.user = req.user || null;
  next();
})




//PASSPORT LOCAL CONFIG
app.use(passport.initialize());
app.use(passport.session());

//USE ROUTES
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/', indexRouter);
app.locals.moment = require('moment');


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
