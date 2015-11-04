'use strict';

var Weather = require('../api/rawWeather/rawWeather.model');
var User = require('../api/user/user.model');
var Forecast = require('../api/forecast/forecast.model');
var CondWeather = require('../api/condweather/condweather.model');

var config = require('../config/environment');
var currentWeather = 'http://api.openweathermap.org/data/2.5/weather';
var forecast = 'http://api.openweathermap.org/data/2.5/forecast';

//Open Weather API
//Doc: http://openweathermap.org/current#geo
var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});

function getCurrentWeather(callback) {
	weather.url = currentWeather;
	//test lat and lon
	User.find({}, function(err, users){
		//will need to ping weather for each user in the database
		for (var i=0; i < users.length ;i++) {
			var userId = users[i]._id.toString();
			//make sure user has cordinates
			if(typeof users[i].cord.lat === 'undefined') continue;
			
			//append the qs(query string of latitude and longitude)
			weather.get({ qs: { lat: users[i].cord.lat, lon: users[i].cord.lon, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
				if (error) return console.log(error);
				
				body.timestamp = new Date().getTime();
				var newWeather = new Weather(body);
				
				newWeather.save(function(err, res) {
					if (err) return console.log(err);
					res.ownerid = userId;
					console.log('successfully ping of current weather and save');
					//callback will condense and save in seperate collection
					callback(res);
				});
			});
		}
	});
}

function createCondDoc(weatherRes){
	var _newCondWeather = {};
	_newCondWeather.temp = weatherRes.main.temp;
	_newCondWeather.humidity = weatherRes.main.humidity;
	_newCondWeather.windspeed = weatherRes.wind.speed;
	_newCondWeather.ownerid = weatherRes.ownerid;
	_newCondWeather.timestamp = weatherRes.timestamp;
	_newCondWeather.grnd_level = weatherRes.main.grnd_level;
	
	//rain property only exist if it rained in pass 3 hours
	_newCondWeather.rain = typeof weatherRes.rain === 'undefined'? '0': _newCondWeather.rain = weatherRes.rain['3h'];
	
	var newCondWeather = new CondWeather(_newCondWeather); 
	
	newCondWeather.save(function(err, res) {
		if (err) return console.log(err);
		console.log('successfully condensed and saved condWeather');
	});
}

function getForecast() {
	//Get all users
	User.find({}, function(err, users){
		//make sure url for getting forecast correct
		weather.url = forecast;
		
		//will need to ping weather for each user in the database
		for (var i=0; i < users.length ;i++) {
		//make sure user has cordinates
		if(typeof users[i].cord.lat === 'undefined') continue;
			
			//append the qs(query string of latitude and longitude)
			weather.get({ qs: { lat: users[i].cord.lat, lon: users[i].cord.lon, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
				if (error) return console.log(error);
				
				body.timestamp = new Date().toString();
				var newForecast = new Forecast(body);
				
				newForecast.save(function(err, res) {
					if (err) return console.log(err);
					console.log('successfully ping of weather forecast and save');
				});
			});
		}
	});
}

module.exports = {
	//do check to see if any request have been made in the last hour
	//if not ping it once then set the interval
	//1 hour is 3600000 milliseconds
	//3h 10800000
	makeEvents: function(){
		 setInterval(function(){
			 getCurrentWeather(createCondDoc);
			 }, 10800000);
		 //86400000 miliseconds in a day
		 //604800000 in 7 days	 
		 setInterval(function(){
		 	 getForecast();
		 }, 604800000);
	}
}