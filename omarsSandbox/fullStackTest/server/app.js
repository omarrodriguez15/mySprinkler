/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var Weather = require('./api/rawWeather/rawWeather.model');
var User = require('./api/user/user.model')

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

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

//do check to see if any request have been made in the last hour
//if not ping it once then set the interval
//1 hour is 3600000 milliseconds
//setInterval(pingWeather, 3600000);

function pingWeather() {
  //test lat and lon
  User.find({}, function(err, users){
    //will need to ping weather for each user in the database
    for (var i=0; i < users.length ;i++) {
      //make sure we have cordinates
      if(typeof users[i].cord.lat === 'undefined') continue;
      //append the qs(query string of latitude and longitude)
      weather.get({ qs: { lat: users[i].cord.lat, lon: users[i].cord.lon, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
        if (error) return console.log(error);
        
        body.timestamp = new Date().toString();
        var newWeather = new Weather(body);
        
        newWeather.save(function(err, sched) {
          if (err) return console.log(err);
        });
      });
    }
  });
}

// Expose app
exports = module.exports = app;
