var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * from employee', function(err,res,fields){
    if (err) throw err;
    res.send(JSON.stringify(res));
  });
  
});

module.exports = router;
