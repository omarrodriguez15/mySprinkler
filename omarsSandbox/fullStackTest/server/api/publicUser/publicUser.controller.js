'use strict';

var _ = require('lodash');
var PublicUser = require('./publicUser.model');
var User = require('../user/user.model');

// Get list of publicUsers
exports.index = function(req, res) {
  if (Object.keys(req.query).length === 0){
    PublicUser.find(function (err, publicUsers) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(publicUsers);
    });
  }
  else if (typeof req.query.piId !== 'undefined' ){
    //get the docs that are older than the timestamp passed in
    User.find({piId :req.query.piId}, function (err, user) {
      if(err) { return handleError(res, err); }
      console.log('full user before strip: '+user);
      stripUser(user, function(usr){
        if (usr === {}){
          console.log('Couldnt strip user :( :');
          return res.status(500).json(usr);
        }else{
          console.log('user after strip: '+usr);
          return res.status(200).json(usr);
        }
      });
    });
  }
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

function stripUser(usr, cb){
  //really ugly hack sorry...
  var x = JSON.stringify(usr);
  var c = JSON.parse(x);
  usr = c[0];
  
  if(usr !== undefined){
    var strippedUsr = {
      name: usr.name,
      ownerid: usr._id,
      serialnumber: usr.piId,
      email: usr.email,
      schedId: usr.schedId,
      settingId: usr.settingId,
      cord: usr.cord,
      role: usr.role 
    };
    return cb(strippedUsr);
  }else{
    console.log('usr is undefined');
    return cb({});
  }
  
}

function handleError(res, err) {
  return res.status(500).send(err);
}