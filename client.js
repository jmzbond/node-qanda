var socket = io.connect('http://localhost:3000');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

var question = 0;

$(function() {

  var $question = $('#question');
  var $answers = $('#answers');

  if (localStorage.getItem('question')) {
    question = localStorage.getItem('question');
  }

  $.get('/question/' + question, function(data) {
    $question.text(data.text);
    $answers.empty();

    for (var i = 0; i < data.answers.length; i++) {
      var item = data.answers[i];

      $answers.append("<div class='answer' data-id='" + i + "'><span class='up'>▲</span><span class='down'>▼</span><span class='score'>" + item.score + "</span><span class='text'>" + item.text + "</span></div>");

    };

    $('#answers .answer .up').click(function() {
      var answer = $(this).parents('.answer').data('id');

      $.post('/question/' + question + '/upvote/' + answer);

      var old_score = parseInt($(this).parents('.answer').find('.score').text(), 10);
      console.log(old_score);

      old_score++;

      $(this).parents('.answer').find('.score').text(old_score);
    });

    $('#answers .answer .down').click(function() {
      var answer = $(this).parents('.answer').data('id');

      $.post('/question/' + question + '/downvote/' + answer);

      var old_score = parseInt($(this).parents('.answer').find('.score').text(), 10);
      console.log(old_score);

      old_score--;

      $(this).parents('.answer').find('.score').text(old_score);
    });
  });

  $('#submit').click(function() {
    var answer = $('#new_answer').val();

    console.log(answer);

    $.post('/question/' + question, {
      text: answer
    }, function(res) {
      $answers.append("<div class='answer' data-id='" + res.answer_id + "'><span class='score'>0</span><span class='text'>" + answer + "</span></div>");
    });
  });
});
