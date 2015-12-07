var mongoose = require('mongoose');

//Create Weather Schema

var WeatherSchema = new mongoose.Schema({
	humidity : Number,
	windspeed : Number,
	ownerid : String,
	timestamp : Number,
	latitude : Number,
	temp_min : Number,
	temp_max : Number,
	elevation : String,
	rain : Number,
	pressure : Number
},{ "strict": false });

module.exports = WeatherSchema;