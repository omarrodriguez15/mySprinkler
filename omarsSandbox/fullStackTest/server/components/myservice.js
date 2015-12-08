'use strict';

var Weather = require('../api/rawWeather/rawWeather.model');
var User = require('../api/user/user.model');
var Forecast = require('../api/forecast/forecast.model');
var CondWeather = require('../api/condweather/condweather.model');

var config = require('../config/environment');
var currentWeather = 'http://api.openweathermap.org/data/2.5/weather';
var forecast = 'http://api.openweathermap.org/data/2.5/forecast/daily';

//Open Weather API
//Doc: http://openweathermap.org/current#geo
var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});

function getCurrentWeather(callback) {
	
	//test lat and lon
	User.find({}, function(err, users){
		//will need to ping weather for each user in the database
		for (var i=0; i < users.length ;i++) {
			updateUsersWeather(users[i], callback);
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
	_newCondWeather.pressure = weatherRes.main.pressure;//pressure at grnd lvl
	_newCondWeather.latitude = weatherRes.coord.lat;
	_newCondWeather.temp_min = weatherRes.main.temp_min;
	_newCondWeather.temp_max = weatherRes.main.temp_max;
	_newCondWeather.icon = weatherRes.weather.icon;
	_newCondWeather.elevation = '112';//367ft or 112 m
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
		
		//will need to ping weather for each user in the database
		for (var i=0; i < users.length ;i++) {
			updateUserForecast(users[i]);
		}
	});
}

function updateUsersWeather(user, callback){
	var userId = user._id.toString();
	//make sure user has cordinates
	if(typeof user.cord.lat === 'undefined') return;
	
	//Open Weather API
	//Doc: http://openweathermap.org/current#geo
	var weather = require('request').defaults({
		url: currentWeather,
		json: true
	});

	//append the qs(query string of latitude and longitude)
	weather.get({ qs: { lat: user.cord.lat, lon: user.cord.lon, APPID: config.openWeather.apiKey, units: 'imperial'} }, function (error, weatherResponse, body) {
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

function updateUserForecast(user){
	var userId = user._id.toString();
	//make sure user has cordinates
	if(typeof user.cord.lat === 'undefined') return;
		
		//Open Weather API
		//Doc: http://openweathermap.org/current#geo
		var weather = require('request').defaults({
			url: forecast,
			json: true
		});
		
		//append the qs(query string of latitude and longitude)
		weather.get({ qs: { lat: user.cord.lat, lon: user.cord.lon, APPID: config.openWeather.apiKey, units: 'imperial'} }, function (error, weatherResponse, body) {
			if (error) return console.log(error);
			
			body.timestamp = new Date().getTime();
			body.ownerid = userId;
			body.city.elevation = '112';//367ft or 112 m
			
			var newForecast = new Forecast(body);

			newForecast.save(function(err, res) {
				if (err) return console.log(err);
				console.log('successfully ping of weather forecast and save');
			});
	});
}

module.exports = {
	//do check to see if any request have been made in the last hour
	//if not ping it once then set the interval
	//1 hour is 3600000 milliseconds
	//3h 10800000
	makeEvents: function(){
		Forecast.find({}, function(err, forecast){
			if (forecast.length < 1){
				console.log('forecast.length: '+forecast.length);
				getForecast();
			}
			Weather.find({}, function(err, weather){
				if (weather.length < 1){
					console.log('weather.length: '+weather.length);
					getCurrentWeather(createCondDoc);
				}
				setInterval(function(){
					getCurrentWeather(createCondDoc);
				}, 10800000);
				//86400000 miliseconds in a day
				//604800000 in 7 days	 
				setInterval(function(){
					getForecast();
				}, 604800000);
			});
		}); 
	},
	getForecast: function(){
			getForecast();
		},
	getCurrentWeather: function(){
			getCurrentWeather(createCondDoc);
		}
}