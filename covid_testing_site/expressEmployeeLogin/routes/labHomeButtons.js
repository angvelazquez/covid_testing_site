var express = require('express');
var router = express.Router();
router.get("/",function(req,res,next){
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lab Home</title>
        <link rel="stylesheet" href="/labHomeStyle.css" />
      </head>
      <body>
          <h1 style="text-align: center">Lab Home</h1>
          <form class="form-inline" action="/testCollection">
            <button type="submit">Test Collection</button>
          </form>
          <form class="form-inline" action="/poolMapping">
            <button type="submit">Pool Mapping</button>
          </form>
          <form class="form-inline" action="/wellTest" method="get">
            <button type="submit">Well Testing</button>
          </form>
      </body>
    </html>`
);
});
module.exports = router;