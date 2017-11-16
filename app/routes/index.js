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


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
    mysql.pool.query("SELECT * from users WHERE email=? AND password=? \
                      VALUES (?, ?)",
                      [req.body.email, req.body.password],
                       function (error, result) {
      if(error){
        next(error);
        //show error message?
        return;
      }
    if (result.length != 1) {
      next(error);
      //TODO: make error page.
      res.render(loginFail);
      return;
    } else {
      res.render(loginSuccess);
      return;
      //TODO: make login success page. res.render...
    }
});


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
      next(error);
      return;
    }

    mysql.pool.query("INSERT INTO users (`first_name`, `last_name`, `email`, `password`, `type`) \
                      VALUES (?, ?, ?, ?, ?)",
                      [req.body.first_name, req.body.last_name,
                       req.body.email, req.body.password, parseInt(req.body.usertype)],
                       function (error, result) {
      if(error){
        next(error);
        return;
      }
      // FIXME: Why doesn't this show the registration page?
      res.render("regSuccess");
    });
  });
});


module.exports = router;
