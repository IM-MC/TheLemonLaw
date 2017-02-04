// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/',function(req,res){
// 	res.sendfile(__dirname + '/main_page.html');
// });

// io.on('connection', function(socket){
// 	console.log('User has been connected');
// 	socket.broadcast.emit('A new user has been connected');
// 	socket.on('chat message', function(msg){
// 		io.emit('chat message', msg);
// 	});
// 	socket.on('disconnect',function(){
// 		console.log('User disconnected');
// 	});
// });


// http.listen(8080, function(){
// 	console.log('listening on *:808');
// });



'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'main_page.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('chat message', function(msg){
  	io.emit('chat message', msg);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});



//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);