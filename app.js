const express = require('express');
const port = process.env.PORT||3000;
var {isrealstring} = require('./server/utils/validation.js');
var {Users} = require('./server/utils/Users');

//----------------------- server set ---------------------------
var app = express();

//---------------------- middleware----------------
app.use(express.static('public'));
// Integrating Socket.IO server
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = new Users();

io.on('connection', function(socket){
  console.log('a user connected');

  // emit events

//join private room 
  socket.on('join',function(params,callback){
  	if(!isrealstring(params.name)||!isrealstring(params.room)){
  		callback('display name and room are reqired ')
  	}
  	socket.join(params.room);
  	//remove user from users array to join new room
  	users.removeUser(socket.id);
  	users.addUser(socket.id,params.name,params.room);
  	io.to(params.room).emit('userlistupdate',users.getUserList(params.room));


  	socket.emit('newMessage', {
    from: 'admin',
    text:`welcome ${params.name} in ${params.room} room`
    });

  	socket.broadcast.to(params.room).emit('new',{
    from: 'admin',
    text:`${params.name} has joined`
    });

  	callback()

  });

  socket.on('createMessage',function(msg,callback){
  	var user = users.getUser(socket.id);
  	if (user) {
  		io.to(user.room).emit('newMessage',{
  			from:user.name,
  			text:msg.text
  		});
  	    callback();
  	}
  	// io.emit('newMessage',msg);
  	// callback();
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var user = users.removeUser(socket.id);
    console.log(users);
    if(user){
    	io.to(user.room).emit('userlistupdate',users.getUserList(user.room));
        socket.broadcast.to(user.room).emit('new',{
           from: 'admin',
           text:`${user.name} has left`
        });
    }
  });
});


//------------------------ server init ------------------
http.listen(port,()=>{
	console.log(`server on ${port}`);
});