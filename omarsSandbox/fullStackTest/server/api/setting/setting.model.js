'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
	wateringtype : String,
	numberofzones : String,
	wateringthreshold : String,
	soiltype : String,
	planttype : String,
	shadedarea : Boolean,
	slopedarea : Boolean 
});

module.exports = mongoose.model('Setting', SettingSchema);