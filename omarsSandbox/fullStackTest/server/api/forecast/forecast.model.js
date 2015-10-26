'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ForecastSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
},{ "strict": false });

module.exports = mongoose.model('Forecast', ForecastSchema);