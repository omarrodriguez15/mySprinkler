'use strict';

var config = require('../config/local.env');
var mongoose = require('mongoose');
var scheduleSchema = require('../models/schedule');
var schedule = mongoose.model('schedule', scheduleSchema);
//maybe use https
var http = require('http');
var querystring = require('querystring');
//host is by default localhost for testing
var host = 'localhost';

module.exports = {
	beginTimer : function(){
		//3600000 miliseconds is an hour
		setInterval(function(){
			postIp();
		}, 3600000);
	}
};

//Needs to get current IP address and PUT it to
//the web server pi collection by using its object ID to find
//the correct document
function putIp(){
	//'Content-Type': 'application/x-www-form-urlencoded'
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		console.log('addr: '+add);
		performRequest('/api/pis', 'POST', {
			name: 'test',
			ownerid: 'jsahd',
			serialnumber: 'hsa89',
			status: '0'
		}, function(data) {
			console.log('response:', data);
		});
		console.log('Post Ip Fired!');
	});
	console.log('PUT Pi info Fired!');
}

//If first time need to create document which includes serial number of pi
//which is in the config file and a status of 0=notverified 
function postIp(){
    //'Content-Type': 'application/x-www-form-urlencoded'
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		console.log('addr: '+add);
		performRequest('/api/pis', 'POST', {
			name: 'test',
			ownerid: 'jsahd',
			serialnumber: 'hsa89',
			status: '0'
		}, function(data) {
			console.log('response:', data);
		});
		console.log('Post Ip Fired!');
	});
}

//need to grab most current weather from web server
//then decide what to write to local db depending on when the
//last time you successfully communincated with the webserver
function getWeather(){
	performRequest('/api/condweather', 'GET', {}, 
		function(data) {
			console.log('response:', data);
		});
	console.log('Get Weather Fired!');
}

//For testing its sending a get request not post
//Production should 
function postSchedule(){
	performRequest('/api/schedules', 'POST', {
			monday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		tuesday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		wednesday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		thursday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		friday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		saturday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		},
		sunday:{
			start: '15:00',
			end: '16:00',
			status: '0'
		}
		}, function(data) {
			console.log('response:', data);
		});
	console.log('GET Schedules Fired!');
}


//function that does heavy lifting
function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  /*
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {*/
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
   // };
   }
  var options = {
	host: host,
	port: config.options.port,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });
  //write the request to the body if needed
  req.write(dataString);
  req.end();
}