'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
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
  },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);