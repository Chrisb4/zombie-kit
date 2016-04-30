$( document ).ready(function() {
  /* Version 1 of getting a question displayed */
  function getNextQuestionV1() {
    var question1 = "How attached are you to your brains?";
    $('#builder').html(question1);
  };
  // getNextQuestionV1();

/* Version 2 of getting a question and 2 choices displayed using AJAX */
  function getNextQuestionV2() {
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
      $('#builder').html('<p>' + question + '</p>');
      $('.productA').text(choiceA);
      $('.productB').text(choiceB);
    });

    nextQuestion.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  };

  getNextQuestionV2();


/* Event listener for choice A, function to display product, and request to hide buttons */
  $('.productA').click(function(e) {
    productChosen('A');
    $('.productA').hide();
    $('.productB').hide();
  });

/* Event listener for choice B, function to display product, and request to hide buttons */
  $('.productB').click(function(e) {
    productChosen('B');
    $('.productA').hide();
    $('.productB').hide();
  });

/* AJAX results function to determine A or B */
  function productChosen(answerClicked) {
    var productDisplay = $.ajax({
      url: '/results',
      type: 'POST',
      dataType: 'json',
      data: { answer: answerClicked }
    });

    productDisplay.done(function(data){
      var product = data.answer;
      $('#builder').html('<p>' + product + '</p>');
    });

    productDisplay.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }




});
