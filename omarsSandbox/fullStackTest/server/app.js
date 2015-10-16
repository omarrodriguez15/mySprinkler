/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

//Open Weather API
//Doc: http://openweathermap.org/current#geo
var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});

//Doc: https://developers.google.com/maps/documentation/geocoding/intro?csw=1
//Example of API request
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
var geoCode = require('request').defaults({
  url: 'https://maps.googleapis.com/maps/api/geocode/json'
})

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

//do check to see if any request have been made in the last hour
//if not ping it once then set the interval
//1 hour is 3600000 milliseconds
//setInterval(pingWeather, 3600000);

//will need to ping weather for each user in the database
function pingWeather() {
  //these are test variables should be removed and dynamic for production
  var addressT = '1600 Amphitheatre Parkway, Mountain View, CA';
  var location;
  
  //convert address to lat and lon
  //this should only been done once this is for testing right now
  geoCode.get({ qs: {address: addressT, key: config.geoCoding.apiKey}}, function(error, response, body){
    if  (error) return console.log(error);
    
    location = JSON.parse(body).results[0].geometry.location;
    console.log(location);
    
    //append the qs(query string of latitude and longitude)
    weather.get({ qs: { lat: location.lat, lon: location.lng, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
      if (error) return console.log(error);
      //db.collection('weathers').insert(body);
      //JSON.stringify(body);
      console.log(body);
    });
  });
}

// Expose app
exports = module.exports = app;
