var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/loginFail', function(req, res, next) {
  res.render('loginFail');
});

router.get('/loginSuccess', function(req, res, next) {
  res.render('loginSuccess');
});

router.post('/login', function(req, res, next) {
  mysql.pool.query("SELECT * FROM users WHERE email=? AND password=?",
                      [req.body.email, req.body.password],
                       function (error, result) {
    if (error || result.length != 1) {
      next(error);
      return;
    } else if (result.length != 1) {
      console.log("no one by that login info");
      let ajax = req.xhr;
      if (ajax) {
        res.json({'msg':'redirect','location':'/loginFail'});
      }
      else {
        req.method = 'get';
        res.redirect('/loginFail');
      }
    } else {
      console.log(result);
      console.log("login successful");
      let ajax = req.xhr;
      if (ajax) {
        res.json({'msg':'redirect','location':'/loginSuccess'});
      }
      else {
        req.method = 'get';
        res.redirect('/loginSuccess');
      }
      //TODO: make session???
      //TODO: send login information to dashboard?
      //option: send info to front end, which will then redirect.
    }
  });
});


module.exports = router;
