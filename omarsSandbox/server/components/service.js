'use strict';

var config = require('../config/local.env');
var _ = require('lodash');
var mongoose = require('mongoose');
var models = require('../models/index');
var http = require('http');
var querystring = require('querystring');
var host = config.options.hostname;

var Pi = mongoose.model('Pi', models.pi);
var Forecast = mongoose.model('forecasts', models.forecast);
var Weather = mongoose.model('weathers', models.weather);
var Schedule = mongoose.model('Schedule', models.schedule);
var sprinklerIsOn = false;
var days=['sunday','monday','tuesday','wednesday','thursday','friday', 'saturday']

module.exports = {
	startUpService : function(){
		console.log('entering begin timer');
		//call startup functions only called once
		onStartup();
	}
};

function getUserProfile(cb){
	console.log('getUserProfile()');

	Pi.find({}, function(err, info){
		if(err){ console.log('err: '+err);}
		//only get user from server if there is no pi doc
		if(info.length < 1){
			
			console.log("Don't have user profile yet so get it!");
			performRequest('/api/publicUsers','GET',{piId : config.serialNumber},function(res){
				
				console.log('Response: '+ JSON.stringify(res));
				var newPi = new Pi(res);
							
				newPi.save(function(err){
					if(err) console.log(err);
					console.log('Saved new Pi info successfully');
					cb();
				});
			});
			
		}
		else{
			console.log('Already have user profile, go on with life.');
			cb();
		}
		
	});
}

//Get schedule from webserver to check status
function getStatus(currDate){
	console.log('getStatus');
	
	Pi.find({}, function(err, info){
		if(info.length > 0){
			performRequest('/api/schedules/'+info[0].schedId,'GET',{},function(res){
				//get current day and time and check that status
				console.log('Response: '+res[days[currDate.getDay()]].status);
				//TODO:
				//if 1 fire py script
				if(res[days[currDate.getDay()]].status === '1' && !sprinklerIsOn){
					turnSprinklerOn();
					sprinklerIsOn = true;
				}
				else if (sprinklerIsOn && res[days[currDate.getDay()]].status === '0'){
					turnSprinklerOff();
					sprinklerIsOn = false;
				}
			});
		}
	});
}

//Get schedule from webserver to update schedule if necessary
function getSchedule(){
	console.log('getSchedule');
	Pi.find({}, function(err, info){
		if(info.length > 0){
			performRequest('/api/schedules/'+info[0].schedId,'GET',{},function(res){
				//TODO:check if different from current schedule
				//if different write to db
				
				//Just overwrite for now
				
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
		}
	});
}

//TODO:hardcoded id
//Get schedule from webserver to check status
function getForecast(){
	console.log('getForecast');
	 
	Pi.find({}, function(err, info){
		//Get the last document saved
		Forecast.find({}).sort({timestamp: -1}).exec(function(err,doc){
			var data;
			if(doc.length > 0 && info.length > 0){
				console.log('Doc found: ',doc);
				data = {
					ownerid: info[0].ownerid, 
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
					ownerid: info[0].ownerid,
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
	
	Pi.find({}, function(err, info){
		//Get the last document saved
		Weather.find({}).sort({timestamp: -1}).exec(function(err,doc){
			var data;
			if(doc.length > 0 && info.length > 0){
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
  
  req.on('error', function(error) {
		// Error handling here
		console.log("Received error: " + error);
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

//fire python script in config.path
function turnSprinklerOn(){
	console.log('turn sprinkler on');
	//run python out of the same directory
	var dir = process.cwd();
	var py = require('child_process').spawn('python', [config.turnOn], {cwd: dir});
	
	py.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});
}

//fire python script in config.path
function turnSprinklerOff(){
	console.log('turn sprinkler off');
	
	var dir = process.cwd();
	//path stored in config
	var py = require('child_process').spawn('python', [config.turnOff], {cwd: dir});
	
	py.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});
}

//just for testing hopefully
	
function setSprinklerTimer(){
	console.log('setSprinklerTimer');
	var currDate = new Date();
	var currDay = days[currDate.getDay()];
	
	Schedule.find({}, function(err, schedule){
		if(schedule.length > 0){
			var start = schedule[0][currDay].start.slice(0,2);
			var end = schedule[0][currDay].end.slice(0,2);
			var startDiff = currDate.getHours() - start;
			var seDiff = end - start;
			
			console.log('Start: '+start);
			console.log('end: '+end);
			console.log('currDate.getHours(): '+currDate.getHours()); 
			console.log('startDiff: '+startDiff);
			console.log('seDiff: '+seDiff); 
			
			//use setTimeout(callback,delay);
			var miliHr = 3600000; //miliseconds is an hour
			
			//currTime is before start
			//12-13=-1
			if (startDiff < 0){
				//get delay in terms of milliseconds
				var delayOn = (startDiff * -1) * miliHr;
				console.log('delayOn: '+delayOn);
				setTimeout(turnSprinklerOn, delayOn);
				
				var delayOff = (seDiff * miliHr) + delayOn;
				console.log('delayOff: '+delayOff);
				setTimeout(turnSprinklerOff, delayOff);
				
				console.log('delayOff - delayOn: '+(delayOff - delayOn));
			}
			//currTime is after start
			//14-13=1
			else if (startDiff > 0){
				console.log('missed watering today??');
			}
			//currTime is start
			//13-13=0
			else if (startDiff === 0){
				turnSprinklerOn();
				var delayOff = (seDiff * miliHr);
				console.log('delayOff: '+delayOff);
				setTimeout(turnSprinklerOff, delayOff);
			}
		}
		else{
			getSchedule();
		}
	});
}

function onStartup(){
	console.log('Starting Up!');
	var currentDate = new Date();
	getUserProfile(function(){
		Forecast.find({}, function(err, forecast){
			if (forecast.length < 1){
				console.log('forecast.length: '+forecast.length);
				getForecast();
			}
		});
		Weather.find({}, function(err, weather){
			if (weather.length < 1){
				console.log('weather.length: '+weather.length);
				getWeather();
			}
		});
		setSprinklerTimer();
		
		
		
		var currHour = currentDate.getHours();
		var diff = 23 - currHour;
		var delayTimer = 0;
		
		if (diff > 0){
			//calculates milliseconds until 2AM
			delayTimer = (diff * 3600000) + 10800000;
		}
		else if (diff < 0){
			console.log('something went wrong setting delayTimer');
		}
		
		console.log('delayTimer: '+delayTimer);
		//At 2AM it will set the new timers for that day and 
		//have a continuous timer set for every day to do the 
		//same at the same time
		setTimeout(function(){
			setSprinklerTimer();
			//86400000 miliseconds in a day
			setInterval(function(){
				setSprinklerTimer();
			}, 86400000);
		}, delayTimer);
		
		
		//3600000 miliseconds is an hour
		//in demo change to 5000 for more real time updating of status 
		setInterval(function(){
			getStatus(currentDate);
		}, 5000);
		
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
	});
}