//Link to required Node packages
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Link to API keys and authentication tokens
var keys = require("./keys.js");

//Process Arguments
var args = process.argv;

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
		query: song || "The Sign (Ace of Base)",
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
	var movieUri = encodeURI(movie) || "Mr%20Nobody";
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

var decideWhatToDo = function(command, argument){
	switch(command){
		case "my-tweets":
			logTweets(argument);
			break;
		case "spotify-this-song":
			spotifySong(argument);
			break;
		case "movie-this":
			omdbMovie(argument);
			break;
		case "do-what-it-says":
			doing();
			break;
		default:
			promptForCommand();
			break;
	}
};

var promptForCommand = function(){
	inquirer.prompt([
		{
			type: "list",
			message: "What do you want to do?",
			choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says", "exit"],
			name: "command"
		}
	]).then(function(response){
		if(response.command === "exit"){
			return;
		}else if (response.command != "do-what-it-says"){
			promptForArg(response.command);
		}
		else{
			decideWhatToDo(response.command);
		}
	});
};

var promptForArg = function(command){
	if(command === "my-tweets"){
		inquirer.prompt([
			{
				type: "input",
				message: "Whose tweets do you want to list?",
				name: "input"
			}
		]).then(function(response){
			decideWhatToDo(command, response.input);
		});
	}else{
		inquirer.prompt([
			{
				type: "input",
				message: "What do you want to search for?",
				name: "input"
			}
		]).then(function(response){
			decideWhatToDo(command, response.input);
		});
	}
};

var parseArgs = function(){
	var argument = "";
	for (var i = 3; i < args.length; i++){
		argument = argument + args[i] + " ";
	};
	return argument;
};

decideWhatToDo(args[2], parseArgs());
