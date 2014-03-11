var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.bodyParser());

server.listen(3000);

var questions = [
	{
		text: "What item would you like to see in the inventory?",
		answers: [
			{ text: "Blender", score: -2 },
			{ text: "Chainsaw", score: 2 },
		]
	}
];

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

app.get('/jquery.js', function (req, res) {
  res.sendfile(__dirname + '/jquery.js');
});

app.get('/question/:question_id', function(req, res) {
	var question_id = req.params.question_id;

	res.send(questions[question_id]);
});

// UPDATE answers SET score = score + 1 WHERE answer = :answer_id
app.post('/question/:question_id/upvote/:answer_id', function(req, res) {
	var question_id = req.params.question_id;
	var answer_id = req.params.answer_id;

	questions[question_id].answers[answer_id].score++;

	res.send('ok');
});

// UPDATE answers SET score = score - 1 WHERE answer = :answer_id
app.post('/question/:question_id/downvote/:answer_id', function(req, res) {
	var question_id = req.params.question_id;
	var answer_id = req.params.answer_id;

	questions[question_id].answers[answer_id].score--;

	res.send('ok');
});

// INSERT INTO answers SET text = :text, score = 0, question_id = :question_id
app.post('/question/:question_id', function(req, res) {
	var question_id = req.params.question_id;

	var index = questions[question_id].answers.push({
		text: req.body.text,
		score: 0
	}) - 1;

	res.send({index: index});
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
