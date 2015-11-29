var mongoose = require('mongoose');

//Create Weather Schema

var piSchema = new mongoose.Schema({
	ip: String,
	name: String,
	ownerid: String,
	userId: String,
	serialnumber: String,
	email: String,
	piId: String,
	settingId: String,
	schedId: String,
	cord: {
		lat: String,
		lon: String
	},
	role: String,
	status: String
},{ "strict": false });

module.exports = piSchema;