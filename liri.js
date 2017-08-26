//Link to required Node packages
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Link to API keys and authentication tokens
var keys = require("./keys.js");

//Logs out the most recent tweets from a userName (Default is @1jean2nat)
var logTweets = function(userName){
	//Instantiate Twitter with Twitter authentication tokens
	var client = new twitter({
  	consumer_key: keys.twitterKeys.consumer_key,
  	consumer_secret: keys.twitterKeys.consumer_secret,
  	access_token_key: keys.twitterKeys.access_token_key,
  	access_token_secret: keys.twitterKeys.access_token_secret
	});
	//Build parameters for REST API query
	var params = {
		screen_name: userName || '1jean2nat',
		count: 20};
	//Call Twitter API to pull last 20 tweets for userName, log to console
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  	if (!error) {
  		for(var x in tweets){
    		console.log(tweets[x].text);
  			console.log("**********");
  		};
  	}else{
  		console.log(error);
  	}
	});
};

//Logs info about a specific song using Spotify API
var spotifySong = function(song){
	//Intantiate Spotify with authentication tokens
	var client = new spotify({
  	id: keys.spotifyKeys.client_id,
  	secret: keys.spotifyKeys.client_secret
	});
	//Build Parameters
	var params = {
		type: "track",
		query: song,
		limit: 1
	};
	//Call Spotify API and log song data
	client.search(params, function(err, data) {
  	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
//		console.log(JSON.stringify(data, null, 2)); 
		console.log("Title: " + data.tracks.items[0].name);
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
	});
};



