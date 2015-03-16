//global variables for map's marker and coordinates
var marker = null;
var lat = null;
var lng = null;

//initialize upon page is loaded
$(document).ready(function() {
	initialize();
});



function initialize() {
	//bind toggle and hide button to respective functions
	$('#toggleMap').bind('click', function() {
		toggleMap();
	});

	$('#hideMap').bind('click', function() {
		hideMap();
	});

	loadMap();

	//for the loading animation to display and to disappear
	$(document).on( "click", ".update-tweets", function() {
	  var $this = $( document ),
	  theme = "b" ,
	  msgText = "loading tweets" ,
	  textVisible = true ,
	  textonly = !!$this.jqmData( "textonly" );
	  html = $this.jqmData( "html" );
	$.mobile.loading( 'show', {
	  text: msgText,
	  textVisible: textVisible,
	  theme: theme,
	  textonly: textonly,
	  html: html
	  });
	})
	.on( "click", ".hide-page-loading-msg", function() {
	  $.mobile.loading( "hide" );
	});

}

//load the map
function loadMap() {
	//initial coordinates to be RPI's coordinates
	var rpi = new google.maps.LatLng(42.72966,  -73.67919);
	lat = 42.72966;
	lng = -73.67919;
	var mapOptions = {
      zoom: 12,
      center: rpi
    };
    var map = new google.maps.Map(document.getElementById('TourMap'),
        mapOptions);

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      title: "Me",
    });

    //every click on map canvas should be able to change the lat and lng variables
    google.maps.event.addListener(map, "click", function(event) {
	    lat = event.latLng.lat();
	    lng = event.latLng.lng();
		marker.setPosition(event.latLng);
	});

}

//toggle the map
function toggleMap(){
	$('#mapPanel').panel( "toggle" );
}

//hide the map
function hideMap() {
	angular.element(document.getElementById('controllerForm')).scope().fetchTweets();
}

//angular js functions
(function(angular) {
  'use strict';

var app = angular.module('TourOnTweets', []);

//controller to gather and display info
app.controller('TweetsController', ['$scope', '$http', function($scope, $http) {
	//getting tweets per user inputs
    $scope.fetchTweets = function() {
    	//close the map panel first
    	$('#mapPanel').panel( "close" );

    	//in case the user has not put anything in, use "" as default topic
    	$scope.topic = $scope.topic == undefined? "" : $scope.topic;
    	var lat1 = lat - 1;
    	var lat2 = lat + 1;
    	var lng1 = lng - 1;
    	var lng2 = lng + 1;

    	//reduce precision so the filter on tweets stream can be wider
    	lat1 = lat1.toFixed(2);
    	lat2 = lat2.toFixed(2);
    	lng1 = lng1.toFixed(2);
    	lng2 = lng2.toFixed(2);

    	//the url for the backend RESTful api
    	//var url = "http://localhost:4000/tweets?" + "geo=" + lng1 + "," + lat1 + "," + lng2 + "," + lat2
    				+ "&key=" + $scope.topic;  
    	var url = "https://tourontweets.herokuapp.com/" + "tweets?" + "geo=" + lng1 + "," + lat1 + "," + lng2 + "," + lat2
    				+ "&key=" + $scope.topic;  
    	//fetch tweets using the backend API
        $http.get(url).
          //upon success, refresh the data and update the views
		  success(function(data, status, headers, config) {
		    $.mobile.loading( "hide" );
		    for (var i = 0; i < data.length; i++) {
		    	var str = data[i]["user"]['profile_image_url_https']; 
		    	if (str == undefined) {
		    		str = "";
		    	} else {
		    		var postfix = "_normal";
		    		var index = str.indexOf(postfix);
		    		var str = str.substring(0, index) + str.substring(index + postfix.length);
		    	}

		    	data[i]["user"]['image_url'] = str;
		    }

		    //refresh the model through controller and update the view
		    $scope.tweets = data;
		    $scope.$apply();
		    $("#Tweets-List").listview("refresh");
		  }).

		  //error handler
		  error(function(data, status, headers, config) {
		    $.mobile.loading( "hide" );
		    alert("error status:"+status);
		  });
    };

}]);

})(window.angular);