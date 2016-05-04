var express = require('express');
var router = express.Router();
var passport = require('passport');

// Models
var User = require('../models/user');
var CartItem = require('../models/cartItem');
var Question = require('../models/question');

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
  res.render('index', { title: 'Zombie Kit', view: 'default' });
});

// GET kit builder page
router.get('/builder', /*isLoggedIn,*/ function(req, res, next) {
  res.render('builder', { title: 'Builder | Zombie Kit', view: 'builder' });
});

// GET shopping_list page. Includes cartItem request to mLab
// May want to add isLoggedIn function
router.get('/shopping_list', function(req, res, next) {
  var cartItemsRequest = CartItem.find({});

  cartItemsRequest.then(function(cartItems) {
    res.render('shopping_list', { title: 'Shopping List | Zombie Kit', cartItems: cartItems});
  });
});

// DELETE FOR DEPLOYMENT
// GET exit page. May want to add isLoggedIn function
router.get('/exit', function(req, res, next) {
  res.render('exit');
});

// DELETE FOR DEPLOYMENT
// GET questions page. Deny access if not logged in
router.get('/questions', function(req, res, next) {
  var question = 'How good are you with swords?';
  res.render('questions', { title: 'Questions | Zombie Kit', question: question });
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

// ROUTES
// GET questions/next route. Includes questions request to mLab
router.get('/questions/next', function(req, res, next) {
  var currentQuestion = parseInt(req.query.currentQuestion);
  var questionsRequest = Question.find({});

  questionsRequest.then(function(questions) {
  var question = questions[currentQuestion];

    if (currentQuestion === questions.length) {
      res.json({status: 'no more questions'});
    } else {
      setTimeout(function(){
        res.json({ question: question.question,
                  choiceA: question.choiceA,
                  choiceB:  question.choiceB});
      }, 2000);
    }
  });
});

/* POST choices route. Creates a response and renders corresponding Amazon product.
Hits Amazon's API. Includes cartItem request to mLab */
router.post('/choices', function(req, res, next) {
  var response;
  var choiceClicked = req.body.choiceClicked;
  var currentQuestion = req.body.currentQuestion;
  var questionsRequest = Question.find({});

  questionsRequest.then(function(questions) {
    var question = questions[currentQuestion];

    if (choiceClicked === 'A') {
      response = question.responseA;
      keyword = question.productKeywordA;
    } else {
      response = question.responseB;
      keyword = question.productKeywordB;
    }

    var productSearch = client.itemSearch({
      keywords: keyword,
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
});

// DELETE ON DEPLOYMENT
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
  console.log(req);
  var cartItem = new CartItem({ userId: req.user._id,
                                title: req.body.product.title,
                                ASIN: req.body.product.ASIN,
                                price: req.body.product.price,
                                image: req.body.product.image });
  cartItem.save(cartItem, function(error) {
    if (error) {
      res.send(error);
    } else {
      res.json(cartItem);
    }
  })
});

// ROUTES FOR NEW USER SIGN UP AND USER LOGIN
// POST route saves a new user to the database and redirects them on success to questions.ejs
router.post('/signup', function(req, res, next) {
  var user = new User({
    username: req.body.username
  });
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
