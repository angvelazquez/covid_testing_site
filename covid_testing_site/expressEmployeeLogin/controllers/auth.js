var mysql = require("mysql");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var checkAuth = require("./check-auth");

var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
  multipleStatements: true,
});

exports.login = async (req, res) => {
  try {
    var labID = req.body.labID;
    var password = req.body.password;
    console.log(labID);

    console.log(req.body);
    // console.log("Super cool: " + (await bcrypt.hash("supercool221", 8)));
    // console.log("password: " + (await bcrypt.hash("password123", 8)));
    // console.log("charizard: " + (await bcrypt.hash("charizard4661", 8)));

    // if (!labID || !password) {
    //   // If either lab ID or password is empty
    //   return res.send("<h1>Empty User or Password</h1>"); // resubmit form
    // }

    db.query(
      `SELECT * FROM LabEmployee WHERE labID = ?`,
      [labID],
      async (error, results) => {
        // Select all lab IDs from the database that match the labID input

        if (
          results.length === 0 ||
          !results ||
          !(await bcrypt
            .compare(password, results[0].password)
            .catch(console.error()))
        ) {
          // If there is no matching labID or the passwords don't match
          res.json({ valid: '1'}); // resubmit form
        } else {
          var id = results[0].labID;

          var token = jwt.sign({ id }, process.env.JWT_SECRET, {
            // creating secure token/cookie
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          var cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          }; // setting cookie expire to be 90 days

          res.cookie("jwt", token, cookieOptions); // injecting cookie to user
          res.json({ valid: '0'});
          // res.redirect("/labHomeButtons")
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
