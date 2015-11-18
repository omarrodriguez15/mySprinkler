'use strict';

var _ = require('lodash');
var Forecast = require('./forecast.model');

// Get list of forecasts
exports.index = function(req, res) {
  if (Object.keys(req.query).length === 0){
    Forecast.find(function (err, forecasts) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(forecasts);
    });
  }
  else if (typeof req.query.ownerid !== 'undefined' ){
    //get docs older than timestamp
    Forecast.find({ownerid :req.query.ownerid}).where('timestamp').lt(parseInt(req.query.timestamp)).exec(function (err, forecasts) {
      if (err) {return handleError(res, err); }
      console.log(forecasts);
      return res.status(200).json(forecasts);
    });
  }
  
};

// Get a single forecast
exports.show = function(req, res) {
  Forecast.findById(req.params.id, function (err, forecast) {
    if(err) { return handleError(res, err); }
    if(!forecast) { return res.status(404).send('Not Found'); }
    return res.json(forecast);
  });
};

// Creates a new forecast in the DB.
exports.create = function(req, res) {
  Forecast.create(req.body, function(err, forecast) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(forecast);
  });
};

// Updates an existing forecast in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Forecast.findById(req.params.id, function (err, forecast) {
    if (err) { return handleError(res, err); }
    if(!forecast) { return res.status(404).send('Not Found'); }
    var updated = _.merge(forecast, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(forecast);
    });
  });
};

// Deletes a forecast from the DB.
exports.destroy = function(req, res) {
  Forecast.findById(req.params.id, function (err, forecast) {
    if(err) { return handleError(res, err); }
    if(!forecast) { return res.status(404).send('Not Found'); }
    forecast.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}