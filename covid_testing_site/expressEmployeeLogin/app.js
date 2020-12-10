var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mariadb = require('mariadb');
var url = require('url');
require('dotenv').config()

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var employeeLogin = require("./routes/employeeLogin");
//var labLogin = require("./routes/labLogin");

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

//console.log("hmmm");
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

//app.use('/', indexRouter);
app.use('/employeeLogin', employeeLogin);
app.use('/employeeHome', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query.email);
  //console.log(query.password);
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
          //console.log(data);
          res.send(data);
        });
});
app.use('/login', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query.email);
  //console.log(query.password);
  //console.log("help");
  pool.query(`select count(*) as valid from ${table} where email='${query.email}'and passcode ='${query.password}'`)
      .then(blah => {
        meep = blah;
        //console.log(meep);
        res.send(meep);
      });
});

app.use('/loginLab', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query.labid);
  //console.log(query.password);
  //console.log("help");
  pool.query(`select count(*) as valid from LabEmployee where labID='${query.labid}'and password ='${query.password}'`)
      .then(blah => {
        meep = blah;
        //console.log(meep);
        res.send(meep);
      });
});

app.use('/wellTest', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query);
  pool.query(`SELECT Distinct WellTesting.poolBarcode as PoolBarcode, WellTesting.wellBarcode as WellBarcode, WellTesting.result FROM WellTesting`)
  .then(data => {
    //console.log(data);
    res.send(data);
  });
});

app.use('/addWell', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query.wellBarcode);
  //console.log(query.action);
  //addwell check for action?
  //console.log(query.result);
  if(query.result==="In+Progress"){
    query.result = "In Progress"
  }
  pool.query(`INSERT INTO WellTesting (poolBarcode, wellBarcode, testingStartTime, testingEndTime, result) 
  values ("${query.poolBarcode}","${query.wellBarcode}","2020-11-18 11:47:30", "2020-11-25 11:47:30","${query.result}")`)
      .then(blah => {
        meep = blah;
        //console.log(meep);
        res.send(meep);
      });
    });

app.use('/editOrDelete', (req, res) => {
  let query = url.parse(req.url, true).query;
  //Automatically makes an (array?) object with two or more checkboxes. 
  //console.log(query.WellPoolResult);
  //Indicates 0 checked. 
  if(query.WellPoolResult==null){
    res.send([]);
  }

  var x = query.WellPoolResult
  //console.log(x)
  //console.log(typeof query.WellPoolResult)
  //console.log(query.action)
  if(typeof query.WellPoolResult == "object"){
    //console.log("uhh")
    x=x[0];
    //console.log(x)
    
  }
  x=x.split(',');
  //console.log(x)
  //if edit then send back the info as well
  if(query.action=="Edit"){
    pool.query(`SELECT Distinct WellTesting.wellBarcode as WellBarcode, WellTesting.poolBarcode as PoolBarcode, WellTesting.result FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}' ORDER BY wellBarcode`)
  .then(blah => {
    meep = blah;
    //console.log(meep);
    //
    if(1==1){
      pool.query(`DELETE FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}'`)
    }
    //console.log(meep);
    //console.log("hello")
    res.send(meep);
  });
  }
  else{
    if(typeof query.WellPoolResult == "object"){
      var x = query.WellPoolResult
      for(i=0; i<x.length;i++){
        y=x[i].split(',')
        //console.log(y)
        pool.query(`DELETE FROM WellTesting
    WHERE wellBarcode='${y[0]}'
    AND poolBarcode='${y[1]}'
    AND result='${y[2]}'`)
    }
    
    }
    else{
      //console.log("asdsad")
      pool.query(`DELETE FROM WellTesting
    WHERE wellBarcode='${x[0]}'
    AND poolBarcode='${x[1]}'
    AND result='${x[2]}'`)
    }
    
    res.send([]);
  }

  //delete in either case
  
});
app.use('/testCollection', (req, res) => {
  let query = url.parse(req.url, true).query;
  pool.query(`SELECT employeeID as EmployeeID, testBarcode as TestBarcode from EmployeeTest`) 
      .then(blah => {
        meep = blah;
        //console.log(meep);
        res.send(meep);
      });
});

app.use('/addTest', (req, res) => {
  let query = url.parse(req.url, true).query;
  //console.log(query.employeeID);
  //console.log(query.testBarcode);
  var x = new Date();
  var y='';
  y+=x.getFullYear()+"-"+x.getMonth()+"-"+x.getDay()+" "+x.getHours()+":"+x.getMinutes()+":"+x.getSeconds()
  //addwell check for action?
  pool.query(`INSERT INTO EmployeeTest (testBarcode, employeeID, collectionTime, collectedBy) 
  values ("${query.testBarcode}","${query.employeeID}","${y}","L1")`)
      .then(blah => {
        meep = blah;
        //console.log(meep);
        res.send(meep);
      });
});

app.use('/deleteTest', (req, res) => {
  let query = url.parse(req.url, true).query;

  var x = query.IdBarcode
  //console.log(x)
  if(x == null){
    res.send([]);
  }
  //console.log(typeof query.IdBarcode)
  //console.log(query.action)
  if(typeof query.IdBarcode == "object"){
    //console.log("uhh")
    x=x[0];
    //console.log(x)
  }
  x=x.split(',');
  //console.log(x)

///////////
  if(typeof query.IdBarcode == "object"){
      var x = query.IdBarcode
      for(i=0; i<x.length;i++){
        y=x[i].split(',')
        //console.log(y)
        pool.query(`DELETE FROM EmployeeTest
    WHERE employeeID='${y[0]}'
    AND testBarcode='${y[1]}'`)
    }
    
    }
    else{
      //console.log("asdsad")
      pool.query(`DELETE FROM EmployeeTest
    WHERE employeeID='${x[0]}'
    AND testBarcode='${x[1]}'`)
    }
    
    res.send([]);
///////////
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
