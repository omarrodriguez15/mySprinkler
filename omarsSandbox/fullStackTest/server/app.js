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

//will need to ping weather for each user in the database
function pingWeather() {
  //test lat and lon
  var Tlat = '30.41643';
  var Tlon = '-95.52654689999997';
  //append the qs(query string of latitude and longitude)
  weather.get({ qs: { lat: Tlat/*location.lat*/, lon: Tlon/*location.lng*/, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
    if (error) return console.log(error);
    //db.collection('weathers').insert(body);
    //JSON.stringify(body);
    
    body.timestamp = new Date().toString();
    console.log(body);
    var newWeather = new Weather(body);
    console.log(newWeather);
    
    newWeather.save(function(err, sched) {
      if (err) return console.log(err);
    });
  });
}

// Expose app
exports = module.exports = app;
