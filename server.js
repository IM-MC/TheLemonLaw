var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/client.html');
});
users = [];

var roomNum = 0;

io.on('connection', function(socket){
	console.log('A user connected');
	socket.on('setUsername', function(data){	// Data is name; setUsername is event name (function called name)
		console.log(data);
		if(users.indexOf(data) > -1){	// if cant find user entered name
			socket.emit('userExists', data + ' username is taken! Try some other username.');
		}
		else{
			users.push(data);	// push to Array
			
			// join room after user name is set
			if (io.nsps['/'].adapter.rooms["room-"+roomNum] && io.nsps['/'].adapter.rooms["room-"+roomNum].length > 1){
				roomNum++;
			}
			socket.join("room-"+roomNum);
			
			//socket.emit('userSet', {username: data});	// username = descrpition
			socket.emit('userSet', {username: data , room: roomNum});	// username = descrpition
			
			
			//io.sockets.in("room-"+roomNum).emit('connectToRoom', "You are in room no. "+roomNum);
		}
	});
	socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.in("room-"+data.room).emit('newmsg', data);
	})

});


http.listen(3000, function(){
  console.log('listening on localhost:3000');
});