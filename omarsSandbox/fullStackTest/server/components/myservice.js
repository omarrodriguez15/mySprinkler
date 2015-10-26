'use strict';

var Weather = require('../api/rawWeather/rawWeather.model');
var User = require('../api/user/user.model');
var config = require('../config/environment');
//Open Weather API
//Doc: http://openweathermap.org/current#geo
var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});

function pingWeather() {
	//test lat and lon
	User.find({}, function(err, users){
		//will need to ping weather for each user in the database
		for (var i=0; i < users.length ;i++) {
		//make sure we have cordinates
		if(typeof users[i].cord.lat === 'undefined') continue;
		
		//append the qs(query string of latitude and longitude)
		weather.get({ qs: { lat: users[i].cord.lat, lon: users[i].cord.lon, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
			if (error) return console.log(error);
			
			body.timestamp = new Date().toString();
			var newWeather = new Weather(body);
			
			newWeather.save(function(err, sched) {
				if (err) return console.log(err);
				console.log('successfully ping of weather and save');
			});
		});
		}
	});
}

module.exports = {
	//do check to see if any request have been made in the last hour
	//if not ping it once then set the interval
	//1 hour is 3600000 milliseconds
	makeEvents: function(){
		 setInterval(pingWeather, 3600000);
	}
}