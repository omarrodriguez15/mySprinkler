'use strict';

var User = require('./user.model');
var Schedule = require('../schedule/schedule.model');
var defaultSchedule = require('../schedule/defaultSchedule');
var Settings = require('../setting/setting.model');
var defaultSettings = require('../setting/defaultSettings');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
//Doc: https://developers.google.com/maps/documentation/geocoding/intro?csw=1
//Example of API request
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
var geoCode = require('request').defaults({
  url: 'https://maps.googleapis.com/maps/api/geocode/json'
});

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  
  //convert address to lat and lon
  //this should only been done once this is for testing right now
  geoCode.get({ qs: {address: newUser.address + ', ' + newUser.city + ', ' + newUser.state , key: config.geoCoding.apiKey}}, function(error, response, body){
    var location;
    if  (error) return console.log(error);
    var newSchedule = new Schedule(defaultSchedule);
    var newSetting = new Settings(defaultSettings);
    
    if( JSON.parse(body) !== {} && JSON.parse(body).results.length > 0) {
      location = JSON.parse(body).results[0].geometry.location;
    }
    else{
      console.log('Unsuccesful conversion of address to cordinates');
      //Default Kyle field cordinates
      location = {
        lat:'30.609883',
        lng:'-96.340458',
      };
    }
   
    newSchedule.save(function(err, sched) {
      newSetting.save(function(err, setting) {
        
        newUser.cord.lat = location.lat;
        newUser.cord.lon = location.lng;
        newUser.provider = 'local';
        newUser.role = 'user';
        newUser.schedId = sched._id;
        newUser.settingId = setting._id;
        
        newUser.save(function(err, user) {
          if (err) return validationError(res, err);
          var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 3600*5 });
          //do intial weather pings for forecast and current weather
          var weatherService = require('../../components/myservice');
          weatherService.getForecast();
          weatherService.getCurrentWeather();
          return res.json({ token: token });
        });
        
      });
    });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
