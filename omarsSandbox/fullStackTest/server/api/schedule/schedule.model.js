'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  monday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	tuesday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	wednesday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	thursday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	friday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	saturday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	},
	sunday:{
		start: String,
		end: String,
		status: String,
		watertoday: Boolean
	}
});

module.exports = mongoose.model('Schedule', ScheduleSchema);