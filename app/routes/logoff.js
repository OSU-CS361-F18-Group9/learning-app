var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user){
    req.session.destroy();
    res.render('logoff');
  }
  else {
    res.render('notLoggedIn');
  }
});

module.exports = router;