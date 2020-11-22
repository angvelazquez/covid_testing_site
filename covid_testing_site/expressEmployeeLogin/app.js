var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mariadb = require('mariadb');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeLogin = require("./routes/employeeLogin");

var app = express();
var table = 'Employee';

var pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_DB,
  port: process.env.DB_PORT,
  connectionLimit:5
});

pool.getConnection();

console.log("hmmm");
//pool.query(`select * from ${table}`)
//    .then(res => {
//      console.log(res); 
//    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/blah', usersRouter);
app.use('/employeeLogin', employeeLogin);
app.use('/employeeHome', (req, res) => {
  
  pool.query(`select * from ${table}`)
    .then(blah => {
      console.log(blah);
      res.send(blah); 
    });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
