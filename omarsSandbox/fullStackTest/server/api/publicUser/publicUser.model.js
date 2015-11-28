'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PublicUserSchema = new Schema({
  name: String,
  email: String,
  piId: String,
  settingId: String,
  userId: String,
  scheduleId: String,
  cord: {
    lat: String,
    lon: String
  },
  role: String  
},{ "strict": false });

module.exports = mongoose.model('PublicUser', PublicUserSchema);