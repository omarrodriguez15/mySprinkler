'use strict';

var config = require('../config/local.env');
var _ = require('lodash');
var mongoose = require('mongoose');
var models = require('../models/index');
var http = require('http');
var querystring = require('querystring');
var host = 'localhost';

module.exports = {
	beginTimer : function(){
		console.log('entering begin timer');
		getUserProfile();
		
		//3600000 miliseconds is an hour
		//in demo change to 5000 for more real time updating of status 
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
	 		//getForecast();
		}, 604800000);
	}
};

function getUserProfile(){
	var Pi = mongoose.model('Pi', models.pi);
	Pi.find({}, function(err, info){
		if(err){ console.log('err: '+err);}
		//only get user from server if there is no pi doc
		if(info.length < 1){
			console.log('getUserProfile');
			
			performRequest('/api/publicUsers','GET',{piId : config.serialNumber},function(res){
				console.log('Response: '+ JSON.stringify(res));
				var newPi = new Pi(res);
							
				newPi.save(function(err){
					if(err) console.log(err);
					console.log('Saved new Pi info successfully');
				});
			});
			
		}
		console.log('Already have user profile');
	});
}

//Get schedule from webserver to check status
function getStatus(){
	console.log('getStatus');
	
	var Pi = mongoose.model('Pi', models.pi);
	Pi.find({}, function(err, info){
		performRequest('/api/schedules/'+info[0].schedId,'GET',{},function(res){
			//get current day and time and check that status
			console.log('Response: '+res.sunday.status);
			//TODO:
			//if 1 fire py script
			if(res.sunday.status === '1'){
				console.log('turn sprinkler on');
				//path stored in config
				var py = require('child_process').spawn('python', [config.path]);
				
				py.stdout.on('data', function (data) {
					console.log('stdout: ' + data);
				});
			}
		});
	});
	
}

//Get schedule from webserver to update schedule if necessary
function getSchedule(){
	console.log('getSchedule');
	var Pi = mongoose.model('Pi', models.pi);
	Pi.find({}, function(err, info){
		performRequest('/api/schedules/'+info[0].schedId,'GET',{},function(res){
			//TODO:check if different from current schedule
			//if different write to db
			
			//Just overwrite for now
			var Schedule = mongoose.model('Schedule', models.pi);
			
			Schedule.findById(info[0].schedId, function (err, schedule) {
				if (err) { return console.log('err: '+err); }
				
				if(!schedule) {
					console.log('Schedule not found creating a new one');
					
					var newSchedule = new Schedule(res);
					newSchedule.save(function(err){
						if(err) {return console.log(err);}
						return console.log('Created new schedule successfully');
					});
				 }
				 else{
					 Schedule.findOneAndUpdate({_id: info[0].schedId}, res, {overwrite: true}, function(){
						 console.log('updated sched:');
					 });
				 }
			});
		});
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
	console.log('Get Weather Fired!');
	var Pi = mongoose.model('Pi', models.pi);
	var Weather = mongoose.model('weathers', models.weather);
	
	Pi.find({}, function(err, info){
		//Get the last document saved
		Weather.find({}).sort({timestamp: -1}).exec(function(err,doc){
			var data;
			if(doc.length > 0){
				console.log('Doc found: ',doc);
				data = {
					ownerid: info[0].ownerid, 
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
					ownerid: info[0].ownerid,
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
	});
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