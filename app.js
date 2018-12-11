const express = require('express');
const port = process.env.PORT||3000;

//----------------------- server set ---------------------------
var app = express();

//---------------------- middleware----------------
app.use(express.static('public'));


//------------------------ server init ------------------
app.listen(port,()=>{
	console.log(`server on ${port}`);
});