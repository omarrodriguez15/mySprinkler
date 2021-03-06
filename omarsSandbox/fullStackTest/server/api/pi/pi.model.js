'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PiSchema = new Schema({
  ip: String,
  name: String,
  ownerid: String,
  serialnumber: String,
  status: String
},{ "strict": false });

module.exports = mongoose.model('Pi', PiSchema);