var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/main_page.html');
});
users = [];

var roomNum = Math.round((Math.random() * 10));

io.set('transports', ['xhr-polling']);
io.set('polling duration', 10);

io.on('connection', function(socket){
	console.log('A user connected');
	socket.on('setUser', function(data){	// Data is name; setUsername is event name (function called name)
		console.log(data.name);
		if(users.indexOf(data.name) > -1){	// if cant find user entered name
			socket.emit('userExists', data.name + ' username is taken! Try some other username.');
		}
		else{
			users.push(data);	// push to Array
			
			// join room after user name is set
			if (io.nsps['/'].adapter.rooms["room-"+roomNum] && io.nsps['/'].adapter.rooms["room-"+roomNum].length > 1){
				roomNum = Math.round((Math.random()* 10));
			}
			socket.join("room-"+roomNum);
			
			//socket.emit('userSet', {username: data});	// username = descrpition
			socket.emit('userSet', {name: data.name ,age:data.age , gender:data.gender, room: roomNum});	// username = descrpition
			
			
			//io.sockets.in("room-"+roomNum).emit('connectToRoom', "You are in room no. "+roomNum);
		}
	});
	
	socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.in("room-"+data.room).emit('newmsg', data);
	})
	
	socket.on('leftRoom',function(data){
		var index = users.indexOf(data.name) ;
		console.log(data.name + 'disconnected from room ' + data.room);
		io.sockets.in("room-"+data.room).emit('newmsg', {message: "disconnected" , name : data.name});
		
		socket.leave("room-"+data.room);
		
		// delete user
		users.splice(index,1);
	});

});


http.listen(3000, function(){
  console.log('listening on localhost:3000');
});