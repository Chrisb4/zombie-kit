var express = require('express');
var router = express.Router();
var passport = require('passport');

// Models
var User = require('../models/user');
var CartItem = require('../models/cartItem');

// Amazon client setup
var amazon = require('amazon-product-api');
var client = amazon.createClient({
  awsId: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_KEY,
  awsTag: process.env.AWS_TAG
});

// VIEWS
// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zombie Kit' });
});

// GET kit builder page
router.get('/builder', function(req, res, next) {
  res.render('builder', { title: 'Builder | Zombie Kit' });
});

// GET shopping_list page. May want to add isLoggedIn function
router.get('/shopping_list', function(req, res, next) {
  res.render('shopping_list');
});

// GET exit page. May want to add isLoggedIn function
router.get('/exit', function(req, res, next) {
  res.render('exit');
});

// GET questions page. Deny access if not logged in
// router.get('/questions', isLoggedIn, function(req, res, next) { (commented out during Dev)
router.get('/questions', function(req, res, next) { //(delete for deployment)
  var question = "How good are you with swords?";
  res.render('questions', { title: 'Questions | Zombie Kit', question: question });
});

// MIDDLEWARE
// middleware for Logging in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

// ROUTES
// QUESTIONS AND CHOICES ROUTES
// GET questions/next route
router.get('/questions/next', function(req, res, next) {
  res.json({ question: 'Do you have any pets you are willing to sacrifice?',
              choiceA: 'I have a pet, but...',
              choiceB: 'no!' });
});

// POST choices route. Choice selected and response route with Amazon product
router.post('/choices', function(req, res, next) {
  var choiceClicked = req.body.choiceClicked;
  var response;
  if (choiceClicked === 'A') {
    response = 'Great, pet brains are tasty';
  } else {
    response = 'no worries, kids will work too';
  }

  var productSearch = client.itemSearch({
    keywords: 'shovel',
    responseGroup: 'ItemAttributes,Offers,Images'
  });

  productSearch.then(function(results) {
    console.log(results[0]);
    var product = {
      title: results[0].ItemAttributes[0].Title[0],
      ASIN: results[0].ASIN[0],
      price: results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0],
      image: results[0].LargeImage[0].URL[0]
    };
    res.json({ response: response, product: product });
  });

  productSearch.catch(function() {
    console.log('product search failed');
  });
});

// AMAZON TEST PRODUCTS ROUTE
// GET product page
router.get('/product', function(req, res, next) {
  // Amazon product search
  var productSearch = client.itemSearch({
    keywords: 'shovel',
    responseGroup: 'ItemAttributes,Offers,Images'
  });

  productSearch.then(function(results) {
    console.log(results[0]);
    var product = {
      title: results[0].ItemAttributes[0].Title[0],
      ASIN: results[0].ASIN[0],
      price: results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0],
      image: results[0].LargeImage[0].URL[0]
    };
    res.render('product', { title: 'Product | Zombie Kit', product: product });
  });

  productSearch.catch(function() {
    console.log('product search failed');
  });
});

// POST cart items route
router.post('/cart-items', function(req, res, next) {
  res.json({ status: 'successful' });
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
