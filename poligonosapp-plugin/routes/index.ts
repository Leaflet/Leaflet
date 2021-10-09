import ServerMain from './src/ServerMain';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  const s = new ServerMain();
  res.render('index', { header: ''+s });
  res.render('index', { body: ''+s });
});

module.exports = router;
