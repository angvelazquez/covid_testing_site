var express = require("express");
var router = express.Router();
router.get("/", function (req, res, next) {
  res.send(
    `<!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <title>Login</title>
        <link rel="stylesheet" href="/loginStyle.css">
      </head>
      <body>
        <h1 style="text-align: center">Lab Login Page</h1>
        <form class="form-inline" action="/mainLogin" method="get">
          <label for="labID" style="margin-right: 77%"> Lab ID: </label>
          <input type="text" id="labID" placeholder="Enter Lab ID" name="labID" />
          <label for="password" style="margin-right: 76%"> Password: </label>
          <input
            type="text"
            id="password"
            placeholder="Enter Password"
            name="password"
          />
          <div style="display: inline-block">
            <button type="submit">Lab Login</button>
          </div>
        </form>
      </body>
    </html>`
  );
});
module.exports = router;
