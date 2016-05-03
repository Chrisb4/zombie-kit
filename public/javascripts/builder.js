$( document ).ready(function() {

// FUNCTION CALLS AND VARIABLES NEEDED AT PAGE LOAD
  // getNextQuestionV1();
  getNextQuestion();
  var currentProduct;
  var currentQuestion = 0;

// EVENT LISTENERS
  // Event listener for choice A, function to display response, and request to hide buttons
  $('.choice-A-button').click(function(e) {
    choiceSelected('A');
    $('#choice-buttons').hide();
  });

  // Event listener for choice B, function to display response, and request to hide buttons
  $('.choice-B-button').click(function(e) {
    choiceSelected('B');
    $('#choice-buttons').hide();
  });

  // Event listener for next question button
  $('.next-question-button').click(function(e) {
    getNextQuestion();
  });

// Event listener for adding product to cart button
  $('.add-to-cart-button').click(function(e) {
    addProductToCart(currentProduct);
  });

// FUNCTIONS
  // Version 1 of getting a question displayed
/*  function getNextQuestionV1() {
    var question1 = "How attached are you to your brains?";
    $('#builder-text').html(question1);
  };*/

  // Version 2 of getting a question and 2 choices displayed with AJAX
  function getNextQuestion() {
    // hidding next question button, add to cart button and the product
    $('.next-question-button').hide();
    $('.add-to-cart-button').hide();
    $('#product-display').html('');

    var nextQuestion = $.ajax({
      url: '/questions/next',
      type: 'GET',
      dataType: 'json'
    });

    nextQuestion.done(function(data){
      console.log(data);
      var question = data.question;
      var choiceA = data.choiceA;
      var choiceB = data.choiceB;
      $('#builder-text').html('<p>' + question + '</p>');
      $('.choice-A-button').text(choiceA);
      $('.choice-B-button').text(choiceB);
      $('#choice-buttons').show();
    });

    nextQuestion.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  };

  // AJAX choice function to determine A or B
  function choiceSelected(choiceClicked) {
    var choiceDisplay = $.ajax({
      url: '/choices',
      type: 'POST',
      dataType: 'json',
      data: { choiceClicked: choiceClicked }
    });

    choiceDisplay.done(function(data){
      var response = data.response;
      // setting product selected to current product global variable
      currentProduct = data.product;
      $('#builder-text').html('<p>' + response + '</p>');
      $('#product-display').html(
        '<ul>' +
          '<li>' + currentProduct.title + '</li>' +
          '<li>' + currentProduct.ASIN + '</li>' +
          '<li>' + currentProduct.price + '</li>' +
          '<li>' +
            '<img src="' + currentProduct.image + '" width=200px>' +
          '</li>' +
        '</ul>');
      $('.add-to-cart-button').show();
      $('.next-question-button').show();
    });

    choiceDisplay.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }

  // Adding product to cart with AJAX call
  function addProductToCart(currentProduct) {
    $('.add-to-cart-button').hide();

    var addToCart = $.ajax({
      url: '/cart-items',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({product: currentProduct})
    });

    addToCart.done(function(data){
      console.log(data);
    });

    addToCart.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  };

});
