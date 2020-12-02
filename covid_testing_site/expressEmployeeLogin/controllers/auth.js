var mysql = require("mysql");
var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")
var collectLabLogin = require("../routes/collectLabLogin");
var labHome = require("../routes/labHomeButtons");

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });

exports.login = async (req, res) => {

    try
    {
        var labID = req.body.labID;
        var password = req.body.password

        if(!labID || !password) // If either lab ID or password is empty
        {
            return res.redirct("/collectLabLogin"); // resubmit form
        }

        db.query(`SELECT * FROM LabEmployee WHERE labID = ?`, [labID], async (error, results) => { // Select all lab IDs from the database that match the labID input

            if(!results || !(await bcrypt.compare(password, results[0].password))) // If there is no matching labID or the passwords don't match
            {
                return res.redirct("/collectLabLogin"); // resubmit form
            }
            else
            {
                var id = results[0].id;

                var token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                var cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie("jwt", token, cookieOptions);
                res.redirect("/labHome");
            }

        })
    }
    catch(error)
    {
        console.log(error);
    }

}