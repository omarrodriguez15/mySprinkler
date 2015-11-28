'use strict';

var _ = require('lodash');
var PublicUser = require('./publicUser.model');
var User = require('../user/user.model');

// Get list of publicUsers
exports.index = function(req, res) {
  PublicUser.find(function (err, publicUsers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(publicUsers);
  });
};

// Get a single publicUser
exports.show = function(req, res) {
  User.find({ piId : req.params.id}, function (err, publicUser) {
    if(err) { return handleError(res, err); }
    if(!publicUser) { return res.status(404).send('Not Found'); }
    console.log('Found User: '+publicUser);
    return res.json(publicUser);
  });
};

// Creates a new publicUser in the DB.
exports.create = function(req, res) {
  PublicUser.create(req.body, function(err, publicUser) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(publicUser);
  });
};

// Updates an existing User in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, publicUser) {
    if (err) { return handleError(res, err); }
    if(!publicUser) { return res.status(404).send('Not Found'); }
    console.log('update body: '+ req.body);
    var updated = _.merge(publicUser, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(publicUser);
    });
  });
};

// Deletes a publicUser from the DB.
exports.destroy = function(req, res) {
  PublicUser.findById(req.params.id, function (err, publicUser) {
    if(err) { return handleError(res, err); }
    if(!publicUser) { return res.status(404).send('Not Found'); }
    publicUser.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}