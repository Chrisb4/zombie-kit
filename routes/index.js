var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var amazon = require('amazon-product-api');
var client = amazon.createClient({
  awsId: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_KEY,
  awsTag: process.env.AWS_TAG
});

/* middleware for Logging in */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zombie Kit' });
});

/* GET kit builder page */
router.get('/builder', function(req, res, next) {
  res.render('builder', { title: 'Builder | Zombie Kit' });
});

/* GET questions/next route */
router.get('/questions/next', function(req, res, next) {
  res.json( { question: 'Do you have any pets you are willing to sacrifice?' } );
});

/* POST results route */
router.post('/results', function(req, res, next) {
  res.json( { answerA: 'yes, one really viscious cat' } );
});

/* GET questions page.  Deny access if not logged in. */
// router.get('/questions', isLoggedIn, function(req, res, next) {
router.get('/questions', function(req, res, next) {
  var question = "How good are you with swords?";
  res.render('questions', {title: 'Questions | Zombie Kit', question: question});
});

router.get('/product', function(req, res, next) {
  /* Amazon product search */
  client.itemSearch({
    keywords: 'shovel',
    responseGroup: 'ItemAttributes,Offers,Images'
  }, function(err, results, response){
    console.log(results[0]);
    var product = {
      title: results[0].ItemAttributes[0].Title[0],
      asin: results[0].ASIN[0],
      price: results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0],
      image: results[0].LargeImage[0].URL[0]
    };
    res.render('product', {title: 'Product | Zombie Kit', product: product});
  });

});

/* GET shopping_list page. May want to add isLoggedIn function */
router.get('/shopping_list', function(req, res, next) {
  res.render('shopping_list');
});

/* GET exit page. May want to add isLoggedIn function */
router.get('/exit', function(req, res, next) {
  res.render('exit');
});


// ROUTES FOR NEW USER SIGN UP AND USER LOGIN
// POST route saves a new user to the database and redirects them on success to questions.ejs
router.post('/signup', function(req, res, next) {
  var user = new User({ username: req.body.username });
  User.register(user, req.body.password, function(error) {
    if (error) {
      res.send(error);
    } else {
      req.login(user, function(loginError) {
        if (loginError) {
          res.send(loginError);
        } else {
          res.redirect('/questions');
        }
      });
    }
  })
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/questions');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
