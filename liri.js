//Link to required Node packages
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var tweetThis = function(userName){
	var params = {
		screen_name: userName || '1jean2nat',
		count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  	if (!error) {
  		for(var x in tweets){
    		console.log(tweets[x].text);
  			console.log("**********");
  		};
  	}
	});
};


