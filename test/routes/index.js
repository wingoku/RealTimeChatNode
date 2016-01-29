var express = require('express');
var app = express();
var router = express.Router();
// var http = require('http');
// // var server = http.createServer(app);

// global.server.listen(app.get('port'));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;