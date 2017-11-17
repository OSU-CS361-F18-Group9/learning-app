var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/register_successful', function(req, res, next) {
  res.render('regSuccess');
});

router.get('/fail_user_exists', function(req, res, next) {
  res.render('regFailUserExists');
})

router.post('/register_new_user', function(req,res,next) {
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
        res.json({'msg':'redirect','location':'/fail_user_exists'});
      }
      else {
        req.method = 'get';
        res.redirect('/fail_user_exists');
      }
      return;
    }

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
        res.json({'msg':'redirect','location':'/register_successful'});
      }
      else {
        req.method = 'get';
        res.redirect('/register_successful');
      }
    });
  });
});

module.exports = router;
