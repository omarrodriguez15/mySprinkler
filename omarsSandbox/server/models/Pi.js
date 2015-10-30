var mongoose = require('mongoose');

//Create Weather Schema

var piSchema = new mongoose.Schema({
	ip: String,
	name: String,
	ownerid: String,
	serialnumber: String,
	status: String
},{ "strict": false });

module.exports = piSchema;