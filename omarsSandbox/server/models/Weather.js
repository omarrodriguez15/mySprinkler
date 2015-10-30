var mongoose = require('mongoose');

//Create Weather Schema

var WeatherSchema = new mongoose.Schema({
	temp: String,
	humidity: String,
	windspeed: String,
	rain: String
},{ "strict": false });

module.exports = WeatherSchema;