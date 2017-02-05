var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

users = [];
client = [];
var timer;
var roomNum ;

app.use(express.static(__dirname));


app.get('/',function(req,res){
	res.sendFile(__dirname + '/main_page.html');
});

app.get('/create', function(req,res){
	res.redirect('/client.html');
});


io.on('connection', function(socket){
	/*
	socket.on('disconnect',function(){
		if (users.length == client.length)
			users.splice(client.indexOf(socket),1);
		client.splice(client.indexOf(socket),1);
	});
	*/
	console.log('A user connected');
	socket.on('setUser', function(data){	// Data is name; setUsername is event name (function called name)
		//console.log(data.name);
		if(users.indexOf(data.name) > -1){	// if cant find user entered name
			socket.emit('userExists', data.name + ' username is taken! Try some other username.');
		}
		else{
			//choose base on gender
			
			if (data.gender == "Male"){
				roomNum = Math.floor((Math.random() * 10) + 1);
			}
			else if(data.gender == "Female"){
				roomNum = Math.floor((Math.random() * 5)+1)*2;
			}
			// chooose base on age
			if  (data.age < 18 ){
				roomNum = Math.floor((Math.random() * 3)+1);
			}
			else {
				roomNum = Math.floor((Math.random() * 10)+4);
			}
			
			// join room after user name is set
			while (io.nsps['/'].adapter.rooms["room-"+roomNum] && io.nsps['/'].adapter.rooms["room-"+roomNum].length > 1){
								// choose base on gender
				if (data.gender == "Male"){
					roomNum = Math.floor((Math.random() * 10) + 1);
				}
				else if(data.gender == "Female"){
					roomNum = Math.floor((Math.random() * 5)+1)*2;
				}
				
				// chooose base on age
				if  (data.age < 18 ){
					roomNum = Math.floor((Math.random() * 3)+1);
				}
				else {
					roomNum = Math.floor((Math.random() * 10)+4);
				}
			}
				
			/*
			if (io.nsps['/'].adapter.rooms["room-"+roomNum] && io.nsps['/'].adapter.rooms["room-"+roomNum].length > 1){
				// choose base on gender
				if (data.gender == "Male"){
					roomNum = Math.floor((Math.random() * 10) + 1);
				}
				else if(data.gender == "Female"){
					roomNum = Math.floor((Math.random() * 5)+1)*2;
				}
				
				// chooose base on age
				if  (data.age < 18 ){
					roomNum = Math.floor((Math.random() * 3)+1);
				}
				else {
					roomNum = Math.floor((Math.random() * 10)+4);
				}
			}
			*/
			data.room = roomNum; 
			socket.join("room-"+roomNum);
			users.push(data);	// push to Array
			client.push(socket);
			
			console.log(data.name + ' ' + data.room);
		
			//If room is full start timer
			
			if (io.nsps['/'].adapter.rooms["room-"+roomNum].length > 1 ){ //if length is 2
				
				var index=[];
				var temp = 0;
				
				for (i=0;i<users.length;i++){ // loop through users
					if(users[i].room == roomNum){
						
						index[temp] = i;
						temp++;
							
					}
				
				}
				temp = index[0];
				console.log(users);
			
				timer = setTimeout(function(){
					client[temp].emit('quit','');
					temp = index[1];
					client[temp].emit('quit','');
							
				}, 10000); // 10 sec
				


			}
			
			//socket.emit('userSet', {username: data});	// username = descrpition
			socket.emit('userSet', {name: data.name ,age:data.age , gender:data.gender, room: roomNum});	// username = descrpition
			
			
			//io.sockets.in("room-"+roomNum).emit('connectToRoom', "You are in room no. "+roomNum);
		}
	});
	/*
	var x = 0;
	var y;
	socket.on('kick',function(data){
		//clearTimeout(timer);
		
		
				
		for (i=0;i<users.length;i++){ // loop through users
			if(users[i].room == data.room){
				//check if same person
				if (users[i].name != data.name){
					x = i;
					y = data.room;
				}
					
			}
		
		}
		client[x].emit('kicked','');
		
	});
	socket.on('forceLeave',function(data){
		io.sockets.in("room-"+data.room).emit('newmsg', {message: "kicked" , name : data.name});
		client[x].leave("room-"+y);
		users.splice(x,1);
	});
	*/
	socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.in("room-"+data.room).emit('newmsg', data);
	})
	
	socket.on('leftRoom',function(data){
		var index = users.indexOf(data.name) ;
		console.log(data.name + 'disconnected from room ' + data.room);
		io.sockets.in("room-"+data.room).emit('newmsg', {message: "disconnected" , name : data.name});
		
				// delete user
		users.splice(index,1);
		socket.leave("room-"+data.room);
		

	});

});


http.listen(PORT,function(){
	console.log('Listening on port: ',PORT);
});