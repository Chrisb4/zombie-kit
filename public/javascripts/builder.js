$( document ).ready(function() {
  function getNextQuestionV1() {
    var question1 = "How attached are you to your brains?";
    $('#builder').html(question1);
  };

  // getNextQuestionV1();

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





});
