$( document ).ready(function() {
  /* Version 1 of getting a question displayed */
  function getNextQuestionV1() {
    var question1 = "How attached are you to your brains?";
    $('#builder').html(question1);
  };

  // getNextQuestionV1();

/* Version 2 of getting a question displayed using AJAX */
  function getNextQuestionV2() {
    var nextQuestion = $.ajax({
      url: '/questions/next',
      type: 'GET',
      dataType: 'json'
    });

    nextQuestion.done(function(data){
      console.log(data);
      var question = data.question;
      $('#builder').html('<p>' + question + '</p>');
    });

    nextQuestion.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  };

  getNextQuestionV2();

  /* AJAX post request for results */
  $('.productA').click(function(e) {
    var productAdisplay = $.ajax({
      url: '/results',
      type: 'POST',
      dataType: 'json',
      data: { answer: 'a' }
    });

    productAdisplay.done(function(data){
      console.log(data);
      var productA = data.answerA;
      $('#produtAdisplay').html('<p>' + productA + '</p>');
    });

    productAdisplay.fail(function(jqXHR, textStatus, errorThrown){
      console.log(errorThrown);
    });
  });






});
