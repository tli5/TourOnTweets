<!doctype html>

<html ng-app="TourOnTweets">
  
  <head>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
    <link rel="stylesheet" href="./geotweets.css" />
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
    <script src="./geotweets.js"></script>
    <script src="./geotweets.css"></script>
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCO4-uh2C2Cpon5LB7NTosT_lVl3mxAOu8">
    </script>
  </head>
  <body >

    <section id="controllerForm" ng-controller="TweetsController" >

      <input ng-model="topic" type="text" placeholder="Topic to track">
      <input id="toggleMap" type="button" value="Toggle Map">
      <input id="getTweets" ng-click="fetchTweets()" class="update-tweets" type="button" value="Get Tweets">


      <ul id="Tweets-List" data-role="listview">
        <li ng-repeat="tweet in tweets" >
          <a href="https://twitter.com/{{tweet['user']['screen_name']}}" class="ui-link-inherit">
            <img ng-src="{{tweet['user']['image_url']}}" class="ui-li-thumb"/>
            <h3 class="ui-li-heading">{{tweet["user"]["name"]}}</h3>
            <p class="ui-li-desc">{{tweet["text"]}}  </p>

          </a>
          
        </li>
      </ul>
    </section>

    

  </body>
  <aside data-role="panel" data-dismissible="false" data-display="overlay" id="mapPanel" >
      <section id="TourMap">
      </section>
      <input id="hideMap" type="button" class="update-tweets" value="Fetch Tweets">
  </aside>
</html>