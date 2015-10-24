'use strict';

var _ = require('lodash');
var RawWeather = require('./rawWeather.model');

// Get list of rawWeathers
exports.index = function(req, res) {
  RawWeather.find(function (err, rawWeathers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(rawWeathers);
  });
};

// Get a single rawWeather
exports.show = function(req, res) {
  RawWeather.findById(req.params.id, function (err, rawWeather) {
    if(err) { return handleError(res, err); }
    if(!rawWeather) { return res.status(404).send('Not Found'); }
    return res.json(rawWeather);
  });
};

// Creates a new rawWeather in the DB.
exports.create = function(req, res) {
  RawWeather.create(req.body, function(err, rawWeather) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(rawWeather);
  });
};

// Updates an existing rawWeather in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  RawWeather.findById(req.params.id, function (err, rawWeather) {
    if (err) { return handleError(res, err); }
    if(!rawWeather) { return res.status(404).send('Not Found'); }
    var updated = _.merge(rawWeather, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(rawWeather);
    });
  });
};

// Deletes a rawWeather from the DB.
exports.destroy = function(req, res) {
  RawWeather.findById(req.params.id, function (err, rawWeather) {
    if(err) { return handleError(res, err); }
    if(!rawWeather) { return res.status(404).send('Not Found'); }
    rawWeather.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}