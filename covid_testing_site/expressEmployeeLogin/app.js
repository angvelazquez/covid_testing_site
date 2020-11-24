var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mariadb = require('mariadb');
var url = require('url');
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
//      console.log(JSON.stringify(res));
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
  let query = url.parse(req.url, true).query;
  console.log(query.email);
  console.log(query.password);
  //if(query.email!=null){
    //if(query.email!='*'){
      //if(query.password!=null){
        //if(query.password!='*'){

        pool.query(`SELECT Distinct Employee.employeeid as id, EmployeeTest.collectionTime as collectionDate, result FROM Employee,EmployeeTest, PoolMap,Pool,WellTesting
        Where employee.email='${query.email}' and employee.passcode='${query.password}'
        and employee.employeeid=employeetest.employeeid
        and employeetest.testbarcode = poolmap.testbarcode
        and poolmap.poolBarcode = pool.poolBarcode
        and wellTesting.poolBarcode = pool.poolBarcode;`)
        .then(data => {
          console.log(data);
          res.send(data);
        });
});
app.use('/login', (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.email);
  console.log(query.password);
  console.log("help");
  pool.query(`select count(*) as valid from ${table} where email='${query.email}'and passcode ='${query.password}'`)
      .then(blah => {
        meep = blah;
        console.log(meep);
        res.send(meep);
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
