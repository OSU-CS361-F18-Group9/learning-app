var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/fail', function(req, res, next) {
  res.render('loginFail');
});

router.get('/success', function(req, res, next) {
  res.render('loginSuccess');
});

router.post('/', function(req, res, next) {
  mysql.pool.query("SELECT first_name, last_name, completion, course_name FROM users u LEFT OUTER JOIN (SELECT sc.sid, completion, course_name FROM student_to_course sc INNER JOIN courses c ON c.id = sc.cid) as t2 ON t2.sid = u.id WHERE email=? AND password=?",
                      [req.body.email, req.body.password],
                       function (error, result) {
    if (error) {
      next(error);
      return;
    } else if (result.length < 1) {
      console.log("no one by that login info");
      let ajax = req.xhr;
      if (ajax) {
        res.json({'msg':'redirect','location':'/login/fail'});
      }
      else {
        req.method = 'get';
        res.redirect('/login/fail');
      }
    } else {
      console.log(result);
      // console.log("login successful");
      let ajax = req.xhr;
      if (ajax) {
        // res.json({'msg':'redirect','location':'/login/success'});
        res.json({
          'msg': 'redirect', 
          'location': '/login/success', 
          'classes': result
        });
      }
      else {
        req.method = 'get';
        res.redirect('/login/success');
      }
      //TODO: make session???
      //TODO: send login information to dashboard?
      //option: send info to front end, which will then redirect.
    }
  });
});




module.exports = router;
