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

var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

setInterval(pingWeather, 3600000);

function pingWeather() {
  var latT = '30.627977', lonT = '-96.334407';
    //append the qs(query string of latitude and longitude)
    weather.get({ qs: { lat: latT, lon: lonT, APPID: config.openWeather.apiKey} }, function (error, weatherResponse, body) {
      if (error) return console.log(error);
      //db.collection('weathers').insert(body);
      //JSON.stringify(body);
      console.log(body);
    });
}

// Expose app
exports = module.exports = app;
