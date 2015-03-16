
var express = require('express');
var app = express();
var fs = require('fs');
app.get('/', function(req,res) {
	fs.readFile("./index.js", function(err, text){
	  res.setHeader("Content-Type", "text/html");
	  res.end(text);
	});
	return;

	res.sendFile(__dirname+'/index.js');
});

app.listen(3000);