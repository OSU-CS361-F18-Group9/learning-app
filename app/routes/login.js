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
  else if (req.session.usertype === 2) {
    var context = {"first_name": req.session.first_name,
                  "last_name": req.session.last_name,
                  "students": req.session.students};
    res.render('teacherDashboard', context);
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
      req.session.usertype = parseInt(req.body.usertype);
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
          req.session.student_first_name = loginResult[0].first_name;
          req.session.student_last_name = loginResult[0].last_name;
          req.session.student_id = loginResult[0].student_id;
          req.session.courses = loginResult;
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
        else {
          req.session.student_id = null;
          req.session.courses = null;
          req.session.student_first_name = null;
          req.session.student_last_name = null;
          req.session.student_id = null;
        }
      })
    });
  }
  else if (parseInt(req.body.usertype) === 2) {
    mysql.pool.query("SELECT * FROM users WHERE email=? AND password=? AND type=?",
                    [req.body.email, req.body.password, parseInt(req.body.usertype)],
                    function(loginError, loginResult) {
      if(loginError) {
        next(loginError);
        return;
      }
      if (loginResult.length === 0) {
        let ajax = req.xhr;
        if (ajax) {
          res.json({'msg':'redirect','location':'/login/fail'});
        }
        else {
          req.method = 'get';
          res.redirect('/login/fail');
        }
      }
      req.session.first_name = loginResult[0].first_name;
      req.session.last_name = loginResult[0].last_name;
      req.session.user = req.body.email;
      req.session.usertype = parseInt(req.body.usertype);
      var teacherID = parseInt(loginResult[0].id);
      mysql.pool.query("SELECT users.first_name as first_name, users.last_name as last_name, \
                        student_to_teacher.sid as student_id, completion, course_name, courses.id as course_id \
                        FROM users INNER JOIN student_to_teacher ON users.id=student_to_teacher.sid \
                        LEFT OUTER JOIN student_to_course ON users.id=student_to_course.sid \
                        INNER JOIN courses ON student_to_course.cid=courses.id WHERE student_to_teacher.tid=?",
                        [teacherID],
                        function(teacherError,teacherResult) {
        if(teacherError) {
          next(teacherError);
          return;
        }
        var students = {};
        for (var i = 0; i < teacherResult.length; i++) {
          var key = String(teacherResult[i].student_id);
          if ( !(key in students) ) {
            students[key] = {"first_name": teacherResult[i].first_name,
                             "last_name": teacherResult[i].last_name,
                             "courses": []};
          }
          students[key]["courses"].push({"course_name": teacherResult[i].course_name,
                                         "completion": teacherResult[i].completion});
        }
        var studentsList = []
        for (var idKey in students) {
          studentsList.push(students[idKey]);
        }
        req.session.students = studentsList;
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
      })
    });
  }
  else if (parseInt(req.body.usertype) === 1) {
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
