var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register');
});

router.get('/successful', function(req, res, next) {
  res.render('regSuccess');
});

router.get('/fail_user_exists', function(req, res, next) {
  res.render('regFailUserExists');
})

router.get('/fail_no_student', function(req, res, next) {
  res.render('regFailNoStudent');
})

router.post('/new_user', function(req,res,next) {
  mysql.pool.query("SELECT * FROM users WHERE email=?",
                  [req.body.email],
                  function (error, result) {
    if(error){
      next(error);
      return;
    }
    
    if (result.length > 0) {
      // E-mail address must be unique - do not allow registration if
      // e-mail is already in the database
      let ajax = req.xhr;
      if (ajax) {
        res.json({'msg':'redirect','location':'/register/fail_user_exists'});
      }
      else {
        req.method = 'get';
        res.redirect('/register/fail_user_exists');
      }
      return;
    }

    if (parseInt(req.body.usertype) !== 3) {
      mysql.pool.query("INSERT INTO users (`first_name`, `last_name`, `email`, `password`, `type`) \
                        VALUES (?, ?, ?, ?, ?)",
                        [req.body.first_name, req.body.last_name,
                        req.body.email, req.body.password, parseInt(req.body.usertype)],
                        function (regError, regResult) {
        if(regError){
          next(regError);
          return;
        }

        // Reference the following for explanation on redirection:
        // http://bit.ly/2ANIB4x
        let ajax = req.xhr;
        if (ajax) {
          res.json({'msg':'redirect','location':'/register/successful'});
        }
        else {
          req.method = 'get';
          res.redirect('/register/successful');
        }
      });
    }
    else if (parseInt(req.body.usertype) === 3) {
      mysql.pool.query("SELECT id FROM users WHERE email=?",
                        [req.body.student_email],
                        function (selError, selResult) {
        if(selError){
          next(selError);
          return;
        }

        // Selected student does not exist
        if (selResult.length === 0) {
          let ajax = req.xhr;
          if (ajax) {
            res.json({'msg':'redirect','location':'/register/fail_no_student'});
          }
          else {
            req.method = 'get';
            res.redirect('/register/fail_no_student');
          }
          return;
        }

        var studentID = selResult[0].id;
        mysql.pool.query("INSERT INTO parents (`first_name`, `last_name`, `email`, `password`, `sid`) \
                          VALUES (?, ?, ?, ?, ?)",
                          [req.body.first_name, req.body.last_name,
                          req.body.email, req.body.password, studentID],
                          function(regError, regResult) {
          if(regError) {
            next(regError);
            return;
          }
          // Reference the following for explanation on redirection:
          // http://bit.ly/2ANIB4x
          let ajax = req.xhr;
          if (ajax) {
            res.json({'msg':'redirect','location':'/register/successful'});
          }
          else {
            req.method = 'get';
            res.redirect('/register/successful');
          }
        });
      });
    }
  });
});

module.exports = router;
