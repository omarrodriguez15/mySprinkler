var mongoose = require('mongoose');


var forecastSchema = new mongoose.Schema({
	city: {
	 type: String,
	 require: true
	},
	percip: {
 	 type: String,
	 require: true
	}
},{ "strict": false });

module.exports = forecastSchema;