'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CondweatherSchema = new Schema({
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

module.exports = mongoose.model('Condweather', CondweatherSchema);