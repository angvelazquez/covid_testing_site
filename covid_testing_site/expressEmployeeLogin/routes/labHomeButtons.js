var express = require('express');
var router = express.Router();
router.get("/",function(req,res,next){
  res.send(
    `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <link rel="stylesheet" href="./CSS/labHomeStyle.css" />
      <title>Lab Home</title>
    </head>
    <body>
      <h1 style={{ textAlign: "center" }}>Lab Home</h1>
      <div className="form-inline">
        <button
          onClick={
            <Redirect
              to={{
                pathname: "/poolMapping",
                search: window.location.href.substring(28),
              }}
            />
          }
        >
          Pool Mapping
        </button>
        <button
          onClick={
            <Redirect
              to={{
                pathname: "/wellTesting",
                search: window.location.href.substring(28),
              }}
            />
          }
        >
          Well Testing
        </button>
      </div>
    </body>
  </html>`
);
});
module.exports = router;