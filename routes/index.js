var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET questions page. */
router.get('/questions', function(req, res, next) {
  res.render('questions');
});

/* GET shopping_list page. */
router.get('/shopping_list', function(req, res, next) {
  res.render('shopping_list');
});

/* GET exit page. */
router.get('/exit', function(req, res, next) {
  res.render('exit');
});







// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect('/');
//   }
// }

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/logout', function(req, res, next) {
//   req.logout();
//   res.redirect('/');
// });

// router.post('/login', passport.authenticate('local'), function(req, res, next) {
//   res.redirect('/profile');
// });

// router.get('/profile', isLoggedIn, function(req, res, next) {
//   res.render('profile', { username: req.user.username })
// });

// router.post('/signup', function(req, res, next) {
//   var user = new User({ username: req.body.username });
//   User.register(user, req.body.password, function(error) {
//     if (error) {
//       res.send(error);
//     } else {
//       req.login(user, function(loginError) {
//         if (loginError) {
//           res.send(loginError);
//         } else {
//           res.redirect('/profile');
//         }
//       });
//     }
//   })
// });

module.exports = router;
