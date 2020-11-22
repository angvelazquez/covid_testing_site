var express = require('express');
var router = express.Router();
router.get("/",function(req,res,next){
  res.send(
    `<div className="App">
    <body>
      <form class="login" action="" method="post">
        <ul class="flex-outer">
          <li>
            <h1>Employee Login Page for Results</h1>
          </li>
          <li>
            <label for="email">Email:</label>
            <input type="text" name="email" value=""></input>
          </li>
          <li>
            <label for="password">Password:</label>
            <input type="text" name="password" value=""></input>
          </li>
          <li>
            <input
              type="submit"
              id="loginButton"
              name="login"
              value="Login"
            ></input>
          </li>
        </ul>
      </form>
    </body>
  </div>`
);
});
module.exports = router;
