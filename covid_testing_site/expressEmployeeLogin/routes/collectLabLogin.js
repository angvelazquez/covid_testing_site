var express = require('express');
var router = express.Router();
router.get("/",function(req,res,next){
  res.send(
    `<html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <title>Login</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="./CSS/loginStyle.css" />
    </head>
    <body>
      <h1 style={{ textAlign: "center" }}>Lab Login Page</h1>
      <form class="form-inline" action="/auth/login" method="POST">
        <label for="labID" style={{ marginRight: "77%" }}>
          Lab ID:
        </label>
        <input
          type="text"
          id="labID"
          placeholder="Enter Lab ID"
          name="labID"
        />
        <label for="password" style={{ marginRight: "76%" }}>
          Password:
        </label>
        <input
          type="text"
          id="password"
          placeholder="Enter Password"
          name="password"
        />
        <div style={{ display: "inline-block" }}>
          <button type="submit">Lab Login</button>
        </div>
      </form>
    </body>
  </html>`
);
});
module.exports = router;