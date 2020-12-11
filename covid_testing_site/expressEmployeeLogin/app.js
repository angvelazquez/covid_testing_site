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
var checkAuth = require("./controllers/check-auth");
var dotenv = require("dotenv");
var util = require("util");
dotenv.config({ path: __dirname + "/.env" });

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var employeeLogin = require("./routes/employeeLogin");
var collectLabLogin = require("./routes/collectLabLogin");
var labHomeButtons = require("./routes/labHomeButtons");
const e = require("express");
// var labLogin = require("./routes/labLogin");

var app = express();
var table = "Employee";

// createPool
var pool = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
  multipleStatements: true,
  // connectionLimit: process.env.DATABASE_CONNECTIONLIMIT,
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
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

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
app.use("/auth", require("./routes/auth"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/styles")));

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

  var ans;
  pool.query(
    `SELECT Distinct Employee.employeeid as id, EmployeeTest.collectionTime as collectionDate, result FROM Employee,EmployeeTest, PoolMap,Pool,WellTesting 
        Where employee.email='${query.email}' and employee.passcode='${query.password}'
        and employee.employeeid=employeetest.employeeid
        and employeetest.testbarcode = poolmap.testbarcode
        and poolmap.poolBarcode = pool.poolBarcode
        and wellTesting.poolBarcode = pool.poolBarcode;`,
    (error, data, fields) => {
      ans = data;
      res.send(data);
    }
  );
});

app.use("/mainLogin", (req, res) => {
  res.send([]);
});

app.use("/login", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.email);
  console.log(query.password);
  console.log("help");
  pool.query(
    `select count(*) as valid from ${table} where email='${query.email}'and passcode ='${query.password}'`,
    (error, blah, fields) => {
      meep = blah;
      console.log("meep: " + meep);
      res.send(meep);
    }
  );
});

app.use("/loginLab", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.labid);
  console.log(query.password);
  console.log("help");
  pool.query(
    `select count(*) as valid from LabEmployee where labID='${query.labid}'and password ='${query.password}'`,
    (error, blah, fields) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    }
  );
});

const query = util.promisify(pool.query).bind(pool);
getPoolMapping = async () => {
  try {
    var ans = [];
    const getPoolBarcodeData = await query(
      `SELECT distinct poolBarcode FROM covid.PoolMap;`
    );
    var stringPoolBarcodeData = JSON.stringify(getPoolBarcodeData);
    var poolBarcodes = JSON.parse(stringPoolBarcodeData);
    for (var i = 0; i < poolBarcodes.length; i++) {
      var obj = poolBarcodes[i];
      const testCodes = await query(
        `SELECT * FROM covid.PoolMap WHERE poolBarcode = ?`,
        [obj.poolBarcode]
      );
      var turnString = JSON.stringify(testCodes);
      var multiTestCodes = JSON.parse(turnString);
      // console.log(multiTestCodes);
      var temp = [];
      for (var j = 0; j < multiTestCodes.length; j++) {
        temp.push(multiTestCodes[j].testBarCode);
      }
      // console.log(obj.poolBarcode);
      // console.log(temp);
      // test = temp;
      // console.log({ pool: obj.poolBarcode, testCodes: temp });
      ans.push({ pool: obj.poolBarcode, testCodes: temp });
    }
    // console.log(ans);
    return ans;
  } catch (error) {
    console.log(error);
  }
};

app.use("/poolMapping", (req, res) => {
  // var ans = [];
  const ans = getPoolMapping();
  ans.then(function (result) {
    res.send(result);
  });
});

app.use("/addPool", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query);
  let poolBarcode = query.poolBarcode;
  let testBarCodes = query.barcode;
  if (typeof testBarCodes === "string") {
    pool.query(
      `INSERT INTO PoolMap (testBarCode, poolBarcode) 
        values ("${testBarCodes}","${poolBarcode}")`
    );
    res.json({ valid: "0" });
  } else {
    for (var i = 0; i < testBarCodes.length; i++) {
      pool.query(
        `INSERT INTO PoolMap (testBarCode, poolBarcode) 
    values ("${testBarCodes[i]}","${poolBarcode}")`
      );
    }
    res.json({ valid: "0" });
  }
});

// app.use("/deletePool", (req, res) => {
//   let poolBarcode = req.body.poolBarcode;
//   let testBarCodes = req.body.testBarCodes;
//   pool.query(
//     `DELETE FROM PoolMap poolBarcode
//   WHERE poolBarcode = "${poolBarcode}";`
//   );
//   for (var i = 0; i < testBarCodes.length; i++) {
//     pool.query(
//       `DELETE FROM PoolMap testBarCode
//     WHERE testBarCode = "${testBarCodes[i]}";`
//     );
//   }
//   res.json({ valid: "0" });
// });

app.use("/editDeletePool", (req, res) => {
  let query = url.parse(req.url, true).query;
  if (query.action === "Edit") {
    let poolBarcode = query.PoolBarcodes;
    if (typeof poolBarcode === "string") {
      pool.query(
        `SELECT * FROM covid.PoolMap WHERE poolBarcode = "${poolBarcode}";`,
        (error, data, fields) => {
          var results = JSON.parse(JSON.stringify(data));
          console.log(results);
          var temp = [];
          for (let i = 0; i < results.length; i++) {
            temp.push({ barcode: results[i].testBarCode });
          }

          var send = { pool: results[0].poolBarcode, tests: temp };
          pool.query(
            `DELETE FROM PoolMap WHERE poolBarcode = "${poolBarcode}";`
          );
          res.send(send);
        }
      );
    } else {
      pool.query(
        `SELECT * FROM covid.PoolMap WHERE poolBarcode = "${poolBarcode[0]}";`,
        (error, data, fields) => {
          var results = JSON.parse(JSON.stringify(data));
          console.log(results);
          var temp = [];
          for (let i = 0; i < results.length; i++) {
            temp.push({ barcode: results[i].testBarCode });
          }

          var send = { pool: results[0].poolBarcode, tests: temp };
          pool.query(
            `DELETE FROM PoolMap WHERE poolBarcode = "${poolBarcode[0]}";`
          );
          res.send(send);
        }
      );
    }
  } else if (query.action === "Delete") {
    console.log("Delete");
    let poolBarcode = query.PoolBarcodes;
    console.log(poolBarcode);
    if (typeof poolBarcode === "string") {
      pool.query(`DELETE FROM PoolMap WHERE poolBarcode = "${poolBarcode}";`);
    } else {
      for (var i = 0; i < poolBarcode.length; i++) {
        pool.query(
          `DELETE FROM PoolMap WHERE poolBarcode = "${poolBarcode[i]}";`
        );
      }
    }
    res.json({ valid: "0" });
  }
});

// app.use("/editPool", (req, res) => {
//   let poolBarcode = req.body.poolBarcode;
//   let testBarCodes = req.body.testBarCodes;
//   pool.query(
//     `DELETE FROM PoolMap poolBarcode
//   WHERE poolBarcode = "${poolBarcode}";`);
//   for(var i = 0; i < testBarCodes.length; i++)
//   {
//     pool.query(
//       `DELETE FROM PoolMap testBarCode
//     WHERE testBarCode = "${testBarCodes[i]}";`);
//   }
//   var send = {pool: poolBarcode, test: testBarCodes};
//   res.send(send);
// });

app.use("/wellTest", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query);
  pool.query(
    `SELECT Distinct WellTesting.poolBarcode as PoolBarcode, WellTesting.wellBarcode as WellBarcode, WellTesting.result FROM WellTesting`,
    (error, data, fields) => {
      console.log(data);
      res.send(data);
    }
  );
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
  pool.query(
    `INSERT INTO WellTesting (poolBarcode, wellBarcode, testingStartTime, testingEndTime, result) 
  values ("${query.poolBarcode}","${query.wellBarcode}","2020-11-18 11:47:30", "2020-11-25 11:47:30","${query.result}")`,
    (error, data, fields) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    }
  );
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
    pool.query(
      `SELECT Distinct WellTesting.wellBarcode as WellBarcode, WellTesting.poolBarcode as PoolBarcode, WellTesting.result FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}'`,
      (error, data, fields) => {
        meep = blah;
        console.log(meep);
        if (typeof query.WellPoolResult == "string") {
          pool.query(`DELETE FROM WellTesting
  WHERE wellBarcode='${x[0]}'
  AND poolBarcode='${x[1]}'
  AND result='${x[2]}'`);
        }
        res.send(meep);
      }
    );
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
app.use("/testCollection", (req, res) => {
  let query = url.parse(req.url, true).query;
  pool.query(
    `SELECT employeeID as EmployeeID, testBarcode as TestBarcode from EmployeeTest`,
    (error, blah, fields) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    }
  );
});

app.use("/addTest", (req, res) => {
  let query = url.parse(req.url, true).query;
  console.log(query.employeeID);
  console.log(query.testBarcode);
  var x = new Date();
  var y = "";
  y +=
    x.getFullYear() +
    "-" +
    x.getMonth() +
    "-" +
    x.getDay() +
    " " +
    x.getHours() +
    ":" +
    x.getMinutes() +
    ":" +
    x.getSeconds();
  //addwell check for action?
  pool.query(
    `INSERT INTO EmployeeTest (testBarcode, employeeID, collectionTime, collectedBy) 
  values ("${query.testBarcode}","${query.employeeID}","${y}","L1")`,
    (error, blah, fields) => {
      meep = blah;
      console.log(meep);
      res.send(meep);
    }
  );
});

app.use("/deleteTest", (req, res) => {
  let query = url.parse(req.url, true).query;

  var x = query.IdBarcode;
  console.log(x);
  if (x == null) {
    res.send([]);
  }
  console.log(typeof query.IdBarcode);
  console.log(query.action);
  if (typeof query.IdBarcode == "object") {
    console.log("uhh");
    x = x[0];
    console.log(x);
  }
  x = x.split(",");
  console.log(x);

  ///////////
  if (typeof query.IdBarcode == "object") {
    var x = query.IdBarcode;
    for (i = 0; i < x.length; i++) {
      y = x[i].split(",");
      console.log(y);
      pool.query(`DELETE FROM EmployeeTest
    WHERE employeeID='${y[0]}'
    AND testBarcode='${y[1]}'`);
    }
  } else {
    console.log("asdsad");
    pool.query(`DELETE FROM EmployeeTest
    WHERE employeeID='${x[0]}'
    AND testBarcode='${x[1]}'`);
  }

  res.send([]);
  ///////////
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

module.exports = app;
