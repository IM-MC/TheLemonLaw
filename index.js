// 'use strict';

// const express = require('express');
// const socketIO = require('socket.io');
// const path = require('path');

// const PORT = process.env.PORT || 3000;
// const INDEX = path.join(__dirname, 'main_page.html');

// const server = express()
//   .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// const io = socketIO(server);


// io.on('connection', (socket) => {
//   socket.on('chat message', function(msg){
//   	io.emit('chat message', msg);
//   });
// });


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

app.get('/',function(req,res){
	res.sendFile(__dirname + '/main_page.html');
});

io.on('connection',function(socket){
	console.log(socket.id);

	var room = 'room 1';

	socket.join(room);

	socket.on('message',function(msg){
		io.sockets.in(room).emit('message',msg,socket.id);
	});

	socket.on('disconnect',function(){
		console.log("User disconnected",socket.id);
	});

	socket.on('change channel',function(newChannel){
		socket.leave(channel);
		socket.join(newChannel);
		room = newChannel;
		socket.emit('change channel',newChannel);
	});

});

http.listen(PORT,function(){
	console.log('Listening on port: ',PORT);
});