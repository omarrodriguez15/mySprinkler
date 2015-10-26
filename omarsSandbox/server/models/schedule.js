var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
	monday:{
		start: String,
		end: String,
		status: String
	},
	tuesday:{
		start: String,
		end: String,
		status: String
	},
	wednesday:{
		start: String,
		end: String,
		status: String
	},
	thursday:{
		start: String,
		end: String,
		status: String
	},
	friday:{
		start: String,
		end: String,
		status: String
	},
	saturday:{
		start: String,
		end: String,
		status: String
	},
	sunday:{
		start: String,
		end: String,
		status: String
	}
},{ "strict": false });

module.exports = scheduleSchema;