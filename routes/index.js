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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {

  client.itemSearch({
    keywords: 'shovel',
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    var product = results[0];
    // console.log(product.ItemLinks[0].ItemLink);
    console.log(JSON.stringify(product, null, 4));

    var product = {
      title: product.ItemAttributes[0].Title[0],
      asin: product.ASIN[0],
      price: product.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0],
      image: product.LargeImage[0].URL[0]
    };
    res.render('index', { title: 'Zombie Kit', product: product});
  }).catch(function(err){
    console.log(JSON.stringify(err, null, 4));
  });


});

/* GET questions page.  Deny access if not logged in. */
router.get('/questions', isLoggedIn, function(req, res, next) {
  res.render('questions');
});

/* GET shopping_list page. May want to add isLoggedInfunction */
router.get('/shopping_list', function(req, res, next) {
  res.render('shopping_list');
});

/* GET exit page. May want to add isLoggedInfunction*/
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
