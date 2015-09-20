var mongoose = require('mongoose');

//Create Weather Schema

var WeatherSchema = new mongoose.Schema({
	city: {
	 type: String,
	 require: true
	},
	percip: {
 	 type: String,
	 require: true
	}
});

module.exports = WeatherSchema;