var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
    res.render('index', { title: 'Express' });
  }
  else {
    res.redirect('/login/dashboard');
  }
});


module.exports = router;
