$( document ).ready(function() {

// FUNCTION CALLS
  // getNextQuestionV1();
  getNextQuestionV2();

// EVENT LISTENERS
  // Event listener for choice A, function to display answer, and request to hide buttons
  $('.choice-A-button').click(function(e) {
    answerChosen('A');
    $('#choice-buttons').hide();
  });

  // Event listener for choice B, function to display answer, and request to hide buttons
  $('.choice-B-button').click(function(e) {
    answerChosen('B');
    $('#choice-buttons').hide();
  });

  // Event listener for next question button
  $('.next-question-button').click(function(e) {
    getNextQuestionV2();
  });

// FUNCTIONS
  // Version 1 of getting a question displayed
/*  function getNextQuestionV1() {
    var question1 = "How attached are you to your brains?";
    $('#builder-text').html(question1);
  };*/

  // Version 2 of getting a question and 2 choices displayed using AJAX
  function getNextQuestionV2() {
    // hidding next question button
    $('.next-question-button').hide();

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

  // AJAX answer function to determine A or B
  function answerChosen(answerClicked) {
    var answerDisplay = $.ajax({
      url: '/answers',
      type: 'POST',
      dataType: 'json',
      data: { answer: answerClicked }
    });

    answerDisplay.done(function(data){
      var answer = data.answer;
      $('#builder-text').html('<p>' + answer + '</p>');
      $('.next-question-button').show();
    });

    answerDisplay.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  }

});
