const express = require('express');
const port = process.env.PORT||3000;

//----------------------- server set ---------------------------
var app = express();

//---------------------- middleware----------------
app.use(express.static('public'));
// Integrating Socket.IO server
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


//------------------------ server init ------------------
http.listen(port,()=>{
	console.log(`server on ${port}`);
});