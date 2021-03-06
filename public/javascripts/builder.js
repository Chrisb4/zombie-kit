$( document ).ready(function() {

// FUNCTION CALLS AND VARIABLES NEEDED AT PAGE LOAD
  var currentQuestion = 0;
  var currentProduct;
  getNextQuestion();

// EVENT LISTENERS
  // Choice A and B; function to display response, and request to hide buttons
  $('.choice-A-button').click(function(e) {
    choiceSelected('A');
    $('#choice-buttons').hide();
  });

  $('.choice-B-button').click(function(e) {
    choiceSelected('B');
    $('#choice-buttons').hide();
  });

  // Next question button; adds 1 to index of questions and gets the next one
  $('.next-question-button').click(function(e) {
    $('#product-display').hide();
    currentQuestion++;
    getNextQuestion();
  });

// Product to cart button and function; Gets parameter from choiceSelected function
  $('.add-to-cart-button').click(function(e) {
    addProductToCart(currentProduct);
  });

// FUNCTIONS
  // Redirects to shopping list when questions run out
  function Redirect() {
    window.location = '/shopping_list';
  }

  // Gets next question and displays the 2 choices. sends currentQuestion to route
  function getNextQuestion() {
    $('.next-question-button').hide();
    $('.add-to-cart-button').hide();
    $('#product-display').html('');
    $('#builder-text').html('');
    // $('.loader').show();

    var nextQuestion = $.ajax({
      url: '/questions/next',
      type: 'GET',
      dataType: 'json',
      data: {currentQuestion: currentQuestion}
    });

    nextQuestion.done(function(data){
      $('.loader').hide();
      var question = data.question;
      var choiceA = data.choiceA;
      var choiceB = data.choiceB;

      if (data.status) {
        Redirect();
      } else {
          $('#builder-text').html('<p>' + question + '</p>');
          $('.choice-A-button').text(choiceA);
          $('.choice-B-button').text(choiceB);
          $('#choice-buttons').show();
        }
    });

    nextQuestion.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }

  // Choice function to determine A or B and display corresponding info
  function choiceSelected(choiceClicked) {
    $('.loader').show();

    var choiceDisplay = $.ajax({
      url: '/choices',
      type: 'POST',
      dataType: 'json',
      data: { choiceClicked: choiceClicked, currentQuestion: currentQuestion }
    });

    choiceDisplay.done(function(data){
      $('.loader').hide();
      var response = data.response;
      // setting product selected to current product global variable
      currentProduct = data.product;
      $('#builder-text').html('<p>' + response + '</p>');
      $('#product-display').html(
        '<div id="product-image">' +
          '<img src="' + currentProduct.image + '" width=200px id="pic">' +
        '</div>' +
        '<div id="product-details">' +
          '<h3>' +
              currentProduct.title + '<br>' +
          '</h3>' +
          '<h4>' +
              currentProduct.price +
          '</h4>' +
        '</div>');

      $('#product-display').show();

      $('.add-to-cart-button').show();
      $('.next-question-button').show();
    });

    choiceDisplay.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }

  // Adding product to cart
  function addProductToCart(currentProduct) {
    $('.add-to-cart-button').hide();
    // $('.loader').show();

    var addToCart = $.ajax({
      url: '/cart-items',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({product: currentProduct})
    });

    addToCart.done(function(data){
      $('.loader').hide();
      $('.next-question-button').trigger('click');
      console.log(data);
    });

    addToCart.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }

});
