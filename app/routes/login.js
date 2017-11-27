var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session.user){
    res.render('login');
  }
  else {
    res.render('alreadyLoggedIn');
  }
});

router.get('/fail', function(req, res, next) {
  res.render('loginFail');
});

router.get('/dashboard', function(req, res, next) {
  if (!req.session.user) {
    res.render("notLoggedIn");
  }
  else if (req.session.usertype === 1) {
    var context = {"first_name": req.session.first_name,
                  "last_name": req.session.last_name,
                  "sid": req.session.student_id,
                  "courses": req.session.courses};
    res.render('studentDashboard', context);
  }
  else if (req.session.usertype === 3) {
    var context = {"first_name": req.session.first_name,
                  "last_name": req.session.last_name,
                  "sid": req.session.student_id,
                  "courses": req.session.courses,
                  "student_first_name": req.session.student_first_name,
                  "student_last_name": req.session.student_last_name,
                  "student_id": req.session.student_id};
    res.render('parentDashboard', context);
  }
});

router.post('/', function(req, res, next) {
  if (parseInt(req.body.usertype) === 3) {
    mysql.pool.query("SELECT * FROM parents WHERE email=? AND password=?",
                    [req.body.email, req.body.password],
                    function(parentError, parentResult) {
      if(parentError) {
        next(parentError);
        return;
      }
      if (parentResult.length === 0) {
        let ajax = req.xhr;
        if (ajax) {
          res.json({'msg':'redirect','location':'/login/fail'});
        }
        else {
          req.method = 'get';
          res.redirect('/login/fail');
        }
      }
      req.session.first_name = parentResult[0].first_name;
      req.session.last_name = parentResult[0].last_name;
      req.session.user = req.body.email;
      mysql.pool.query("SELECT users.first_name as first_name, users.last_name as last_name, \
                        users.id as student_id, completion, course_name, courses.id as course_id \
                        FROM parents INNER JOIN users ON parents.sid=users.id LEFT OUTER JOIN \
                        student_to_course ON users.id=student_to_course.sid INNER JOIN courses ON \
                        student_to_course.cid=courses.id WHERE parents.email=?",
                        [req.body.email],
                        function(loginError,loginResult) {
        if(loginError) {
          next(loginError);
          return;
        }
        if (loginResult.length > 0) {
          req.session.usertype = parseInt(req.body.usertype);
          req.session.student_first_name = loginResult[0].first_name;
          req.session.student_last_name = loginResult[0].last_name;
          req.session.student_id = loginResult[0].student_id;
          req.session.courses = loginResult;
          console.log(loginResult);
          let ajax = req.xhr;
          if (ajax) {
            res.json({
              'msg': 'redirect', 
              'location': '/login/dashboard', 
            });
          }
          else {
            req.method = 'get';
            res.redirect('/login/dashboard');
          }
        }
      })
    });
  }
  if (parseInt(req.body.usertype) === 1) {
    mysql.pool.query("SELECT first_name, last_name, u.id as student_id, completion, course_name, cid as course_id FROM users u LEFT OUTER JOIN (SELECT sc.sid, completion, course_name, cid FROM student_to_course sc INNER JOIN courses c ON c.id = sc.cid) as t2 ON t2.sid = u.id WHERE email=? AND password=?",
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
        req.session.user = req.body.email;
        req.session.usertype = parseInt(req.body.usertype);
        req.session.first_name = result[0].first_name;
        req.session.last_name = result[0].last_name;
        req.session.student_id = result[0].student_id;
        req.session.courses = result;
        console.log(result);
        let ajax = req.xhr;
        if (ajax) {
          res.json({
            'msg': 'redirect', 
            'location': '/login/dashboard', 
          });
        }
        else {
          req.method = 'get';
          res.redirect('/login/dashboard');
        }
      }
    });
  }
});


module.exports = router;
