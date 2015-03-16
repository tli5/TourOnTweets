var Twitter = require('twitter');
var url = require('url');
var fs = require('fs');
var path = require('path');

var client = new Twitter({
  consumer_key: 'F3IM8lwYaFU9vmIAsLl3OI5Nd',
  consumer_secret: 'VTWkwlAwq3qO1STelW6k2oc4fYZBN65yPeo9n6JLSAnSMDuXyU',
  access_token_key: '2981430418-wnYzUC5Dqa8xSoAFeMKLyjyknEhOPSLxNboJT9m',
  access_token_secret: 'JQpKrTW4Kp86UZtONqnsNKk3PtSu0hWdElZ1odJc2FrEM'
});



//function used to fetch tweets and send back results
function fetchTweets(locs, key, res) {
  //calling twitter stream API with key word and locations
  client.stream('statuses/filter', {track: key, locations: locs},  function(stream){
    var tweets = [];
    var count = 0;
    var max = 5;
    
    var fd = fs.openSync("./json/geotweets.json", 'w');

    //appending streams to the existing array, and destroy the stream once the array is filled
    stream.on('data', function(tweet) {
      tweets.push(tweet);
      count++;
      
      if (count >= max) {
        fs.writeSync(fd, JSON.stringify(tweets));
        fs.closeSync(fd);
        res.sendFile(__dirname+'/json/geotweets.json');
        stream.destroy();

        tweets = [];
        count = 0;
      }
    });

    stream.on('error', function(error) {
      //console.log(error);
    });
  });
}


//using express to build the RESTful API
var express = require('express');
var app = express();

//using static files here
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'json')));

//send back index page as default
app.get('/', function(req,res) {
  var info = url.parse(req.url ,true);
  var pathname = info["pathname"];  

	fs.readFile("./index.js", function(err, text){
	  res.setHeader("Content-Type", "text/html");
	  res.end(text);
	});
	return;

});

//the only endpoint this restful API, sending back tweets based on the key word and coordinates
app.get('/tweets', function(req,res) {
  var info = url.parse(req.url ,true);
  var locs = info["query"]["geo"];
  var key = info["query"]["key"];
  fetchTweets(locs, key, res);

});
app.listen(4000);

module.exports = app;