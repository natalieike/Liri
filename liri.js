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
  	if (error) {
  		console.log(error);
  		return;
  	}
  	for(var x in tweets){
   		console.log(tweets[x].text);
 			console.log("**********");
 		}; 
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
	client.search(params, function(error, data) {
  	if (error) {
  		console.log(error);
    	return;
  	}
		console.log("Title: " + data.tracks.items[0].name);
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
	});
};

var omdbMovie = function(movie){
	var key = keys.omdbKeys.api_key;
	var movieUri = encodeURI(movie);
	var url = "http://www.omdbapi.com/?apikey=" + key + "&plot=short&t=" + movieUri;
	request(url, function (error, response, body) {
		if(error){
  		console.log(error); 
  		return;
		}
		bodyJson = JSON.parse(body);
  	console.log("Title: " + bodyJson.Title);
  	console.log("Year: " + bodyJson.Year);
  	for(var i = 0; i < bodyJson.Ratings.length; i++){
  		console.log(bodyJson.Ratings[i].Source + " Rating: " + bodyJson.Ratings[i].Value);
  	};
  	console.log("Country: " + bodyJson.Country);
  	console.log("Plot: " + bodyJson.Plot);
  	console.log("Actors: " + bodyJson.Actors);
	});
};

var doing = function(){
	fs.readFile("./random.txt", "utf8", (error, data) => {
		if(error){
			console.log(error);
			return;
		}
		var argArray = data.split(",");
		decideWhatToDo(argArray[0], argArray[1]);
	});
}




