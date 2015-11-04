'use strict';

var _ = require('lodash');
var Condweather = require('./condweather.model');

// Get list of condweathers
exports.index = function(req, res) {
  if (Object.keys(req.query).length === 0){
    Condweather.find(function (err, condweathers) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(condweathers);
    });
  }
  else if (typeof req.query.ownerid !== 'undefined' ){
    //get the docs that are older than the timestamp passed in
    Condweather.find({ownerid :req.query.ownerid}).where('timestamp').lt(parseInt(req.query.timestamp)).exec(function (err, condweathers) {
      if(err) { return handleError(res, err); }
      console.log(condweathers);
      return res.status(200).json(condweathers);
    });
  }
};

// Get a single condweather
exports.show = function(req, res) {
  Condweather.findById(req.params.id, function (err, condweather) {
    if(err) { return handleError(res, err); }
    if(!condweather) { return res.status(404).send('Not Found'); }
    return res.json(condweather);
  });
};

// Creates a new condweather in the DB.
exports.create = function(req, res) {
  Condweather.create(req.body, function(err, condweather) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(condweather);
  });
};

// Updates an existing condweather in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Condweather.findById(req.params.id, function (err, condweather) {
    if (err) { return handleError(res, err); }
    if(!condweather) { return res.status(404).send('Not Found'); }
    var updated = _.merge(condweather, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(condweather);
    });
  });
};

// Deletes a condweather from the DB.
exports.destroy = function(req, res) {
  Condweather.findById(req.params.id, function (err, condweather) {
    if(err) { return handleError(res, err); }
    if(!condweather) { return res.status(404).send('Not Found'); }
    condweather.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}