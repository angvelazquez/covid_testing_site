var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mysql = require("mysql");
var url = require("url");
var dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var employeeLogin = require("./routes/employeeLogin");
var collectLabLogin = require("./routes/collectLabLogin");
var labHomeButtons = require("./routes/labHomeButtons");
// var labLogin = require("./routes/labLogin");

var app = express();
var table = "Employee";

// createPool
var pool = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  // connectionLimit: process.env.DATABASE_CONNECTIONLIMIT,
  database: process.env.DATABASE
});

// pool.getConnection((err, connection) => {
//   if (err) {
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       console.error("Database connection was closed.");
//     }
//     if (err.code === "ER_CON_COUNT_ERROR") {
//       console.error("Database has too many connections.");
//     }
//     if (err.code === "ECONNREFUSED") {
//       console.error("Database connection was refused.");
//     }
//   }
//   if (connection) connection.release();
//   return;
// });

pool.connect((error) => {
  if(error)
  {
    console.log(error)
  }
  else
  {
    console.log("MYSQL Connected...")
  }
})

console.log("hmmm");
//pool.query(`select * from ${table}`)
//    .then(res => {
//      console.log(JSON.stringify(res));
//    });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/auth", require("./routes/auth"))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use('/', indexRouter);
// app.use('/blah', usersRouter);
app.use("/employeeLogin", employeeLogin);
app.use("/collectLabLogin", collectLabLogin);
app.use("/labHomeButtons", labHomeButtons);
// app.use('/labLogin', labLogin);
app.use("/employeeHome", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.email);
  console.log(query.password);
  //if(query.email!=null){
  //if(query.email!='*'){
  //if(query.password!=null){
  //if(query.password!='*'){

  pool
    .query(
      `SELECT Distinct Employee.employeeid as id, EmployeeTest.collectionTime as collectionDate, result FROM Employee,EmployeeTest, PoolMap,Pool,WellTesting 
        Where employee.email='${query.email}' and employee.passcode='${query.password}'
        and employee.employeeid=employeetest.employeeid
        and employeetest.testbarcode = poolmap.testbarcode
        and poolmap.poolBarcode = pool.poolBarcode
        and wellTesting.poolBarcode = pool.poolBarcode;`
    )
    .then((data) => {
      console.log(data);
      res.send(data);
    });
});

app.use("/login", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.email);
  console.log(query.password);
  console.log("help");
  pool
    .query(
      `select count(*) as valid from ${table} where email='${query.email}'and passcode ='${query.password}'`
    )
    .then((blah) => {
      meep = blah;
      console.log("meep: " + meep);
      res.send(meep);
    });
});

app.use("/loginLab", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.labid);
  console.log(query.password);
  console.log("help");
  pool
    .query(
      `select count(*) as valid from LabEmployee where labID='${query.labid}'and password ='${query.password}'`
    )
    .then((blah) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    });
});

app.use("/wellTest", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query);
  pool
    .query(
      `SELECT Distinct WellTesting.poolBarcode as PoolBarcode, WellTesting.wellBarcode as WellBarcode, WellTesting.result FROM WellTesting`
    )
    .then((data) => {
      console.log(data);
      res.send(data);
    });
});

app.use("/addWell", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.wellBarcode);
  console.log(query.action);
  //addwell check for action?
  console.log(query.result);
  if (query.result === "In+Progress") {
    query.result = "In Progress";
  }
  pool
    .query(
      `INSERT INTO WellTesting (poolBarcode, wellBarcode, testingStartTime, testingEndTime, result) 
  values ("${query.poolBarcode}","${query.wellBarcode}","2020-11-18 11:47:30", "2020-11-25 11:47:30","${query.result}")`
    )
    .then((blah) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    });
});

app.use("/editOrDelete", (req, res) => {
  let query = url.parse(req.url, true).query;
  //Automatically makes an (array?) object with two or more checkboxes.
  //console.log(query.WellPoolResult);
  //Indicates 0 checked.
  if (query.WellPoolResult == null) {
    res.send([]);
  }

  var x = query.WellPoolResult;
  console.log(x);
  console.log(typeof query.WellPoolResult);
  console.log(query.action);
  if (typeof query.WellPoolResult == "object") {
    console.log("uhh");
    x = x[0];
    console.log(x);
  }
  x = x.split(",");
  console.log(x);
  //if edit then send back the info as well
  if (query.action == "Edit") {
    pool
      .query(
        `SELECT Distinct WellTesting.wellBarcode as WellBarcode, WellTesting.poolBarcode as PoolBarcode, WellTesting.result FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}'`
      )
      .then((blah) => {
        meep = blah;
        console.log(meep);
        if (typeof query.WellPoolResult == "string") {
          pool.query(`DELETE FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}'`);
        }
        res.send(meep);
      });
  } else {
    if (typeof query.WellPoolResult == "object") {
      var x = query.WellPoolResult;
      for (i = 0; i < x.length; i++) {
        y = x[i].split(",");
        console.log(y);
        pool.query(`DELETE FROM WellTesting
    WHERE wellBarcode='${y[0]}'
    AND poolBarcode='${y[1]}'
    AND result='${y[2]}'`);
      }
    } else {
      console.log("asdsad");
      pool.query(`DELETE FROM WellTesting
    WHERE wellBarcode='${x[0]}'
    AND poolBarcode='${x[1]}'
    AND result='${x[2]}'`);
    }

    res.send([]);
  }

  //delete in either case
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000)
module.exports = app;
