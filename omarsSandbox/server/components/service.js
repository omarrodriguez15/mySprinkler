'use strict';

var config = require('../config/local.env');
var mongoose = require('mongoose');
var models = require('../models/index');
//var weatherSchema = require('../models/Weather');
var http = require('http');
var querystring = require('querystring');
var host = 'localhost';
/*
var scheduleSchema = require('../models/schedule');
var schedule = mongoose.model('schedule', scheduleSchema);
*/

module.exports = {
	beginTimer : function(){
		//3600000 miliseconds is an hour
		setInterval(function(){
			getStatus();
		}, 3600000);
		//3600000 miliseconds is an hour
		setInterval(function(){
			getSchedule();
			//postIp();
		}, 3600000);
		
		//3 hours = 10800000 milliseconds
		setInterval(function(){
			getWeather();
		}, 10800000);
		
		//86400000 miliseconds in a day
		//604800000 in 7 days	 
		setInterval(function(){
	 		getForecast();
		}, 604800000);
	}
};

//TODO:ScheduleId hardcoded
//Get schedule from webserver to check status
function getStatus(){
	console.log('getStatus');
	performRequest('/api/schedules/'+config.schedulesId,'GET',{},function(res){
		console.log('Response: '+res.sunday.status);
		//TODO:
		//if 1 fire py script
		//path to script
		var path = '/Users/jabba/Desktop/test.py';
		var py = require('child_process').spawn('python', [path]);

		py.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});
	});
}

//TODO:Get user info No api endpoint yet
function getUserProfile(){
	var Pi = mongoose.model('Pi', models.pi);
	var pi_info = Pi.find({});
	
	console.log('getUserProfile');
	
	performRequest('/api/publicUser/'+pi_info.userId,'GET',{},function(res){
		console.log('Response: '+ res);
	});
}

//TODO:hardcoded id
//Get schedule from webserver to update schedule if necessary
function getSchedule(){
	console.log('getSchedule');
	performRequest('/api/schedules/'+config.schedulesId,'GET',{},function(res){
		console.log('Response: '+res.sunday.status);
		//check if different from current schedule
		//if different write to db
	});
}
//TODO:hardcoded id
//Get schedule from webserver to check status
function getForecast(){
	 var Forecast = mongoose.model('forecasts', models.forecast);
	//Get the last document saved
	Forecast.find({}).sort({timestamp: -1}).exec(function(err,doc){
		var data;
		if(doc.length > 0){
			console.log('Doc found: ',doc);
			data = {
				ownerid: config.userId, 
				timestamp: doc.timestamp
				};
			performRequest('/api/forecasts', 'GET', data, 
			function(res) {
				console.log('response:', res,'response length: ',res.length);
				if(res.length > 0){
					var newForecast = new Forecast(res);
					
					newForecast.save(function(err){
						if(err) console.log(err);
					});
				}
			});
		}
		else{//get first doc
			console.log('Forecast no docs found');
			data = {
				ownerid: config.userId,
				timestamp: new Date().getTime()
				};
			
			performRequest('/api/forecasts', 'GET', data, 
			function(res) {
				var newForecast = new Forecast(res);
				
				newForecast.save(function(err){
					if(err) console.log(err);
				});
				console.log('Forecast response:', res);
			});
		}
	});
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
		}, function(res) {
			console.log('response:', res);
		});
		console.log('Post Ip Fired!');
	});
}

//get condensed weather info from webserver
//save to local db
function getWeather(){
	var Weather = mongoose.model('weathers', models.weather);
	//Get the last document saved
	Weather.find({}).sort({timestamp: -1}).exec(function(err,doc){
		var data;
		if(doc.length > 0){
			console.log('Doc found: ',doc);
			data = {
				ownerid: config.userId, 
				timestamp: doc.timestamp
				};
			performRequest('/api/condweather', 'GET', data, 
			function(res) {
				console.log('response:', res,'response length: ',res.length);
				if(res.length > 0){
					var newWeather = new Weather(res);
					
					newWeather.save(function(err){
						if(err) console.log(err);
					});
				}
			});
		}
		else{//get first doc
			console.log('no docs found');
			data = {
				ownerid: config.userId,
				timestamp: new Date().getTime()
				};
			
			performRequest('/api/condweather', 'GET', data, 
			function(res) {
				var newWeather = new Weather(res);
				
				newWeather.save(function(err){
					if(err) console.log(err);
				});
				console.log('response:', res);
			});
		}
	});
	
	
	console.log('Get Weather Fired!');
}

//For testing its sending a get request not post
//Production should 
function postSchedule(){
	performRequest('/api/schedules', 'POST', testScheduleObject, function(res) {
			console.log('response:', res);
		});
	console.log('Post Schedules Fired!');
}


//function that does heavy lifting
function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET' && data !== {}) {
    endpoint += '?' + querystring.stringify(data);
  }
  headers = {
  	'Content-Type': 'application/json',
	'Content-Length': dataString.length
  };
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
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });
  //write the request to the body if needed
  req.write(dataString);
  req.end();
}


//Needs to get current IP address and PUT it to
//the web server pi collection by using its object ID to find
//the correct document
function putIp(){
	//'Content-Type': 'application/x-www-form-urlencoded'
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		console.log('addr: '+add);
		performRequest('/api/pis', 'POST', {
			ip: add,
			name: 'test',
			ownerid: 'jsahd',
			serialnumber: 'hsa89',
			status: '0'
		}, function(res) {
			console.log('response:', res);
		});
		console.log('Post Ip Fired!');
	});
	console.log('PUT Pi info Fired!');
}

//Just for testing
var testScheduleObject = {
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
	};