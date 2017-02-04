var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
	res.sendfile(__dirname + '/main_page.html');
});

io.on('connection', function(socket){
	console.log('User has been connected');
	socket.broadcast.emit('A new user has been connected');
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	socket.on('disconnect',function(){
		console.log('User disconnected');
	});
});


http.listen(8080, function(){
	console.log('listening on *:808');
});