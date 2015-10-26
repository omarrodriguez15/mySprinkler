'use strict';

var config = require('../config/local.env');
var mongoose = require('mongoose');
var scheduleSchema = require('../models/schedule');
var schedule = mongoose.model('schedule', scheduleSchema);
var http = require('http');

//For testing its default hostname is localhost
//production this will be set in config
var options = {
		port: config.options.port,
	};

module.exports = {
	beginTimer : function(){
		//3600000 miliseconds is an hour
		setInterval(postSchedule, 5000);
	},
	sendIp : function(){
		return console.log('send Ip');
	},
	getWeather: function(){
		return console.log('get weather');
	},
	sendSn : function(){
		return console.log('send serial number');
	} 
};

//Needs to get current IP address and PUT it to
//the web server pi collection by using its object ID to find
//the correct document
function putIp(){
	options.path = '/api/pi';
	options.method = 'PUT';
	
	http.request(options, function(res){
		
		res.on('data', function(d) {
			var data = JSON.parse(d);
			console.log(data);
		});
		
		res.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
	}).end();
	console.log('PUT Pi info Fired!');
}

//If first time need to create document which includes serial number of pi
//which is in the config file and a status of 0=notverified 
function postIp(){
	options.path = '/api/pi';
	options.method = 'POST';
	
	http.request(options, function(res){
		
		res.on('data', function(d) {
			var data = JSON.parse(d);
			console.log(data);
		});
		
		res.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
	}).end();
	console.log('Post Ip Fired!');
}

//need to grab most current weather from web server
//then decide what to write to local db depending on when the
//last time you successfully communincated with the webserver
function getWeather(){
	options.path = '/api/weather';
	options.method = 'GET';
	
	http.request(options, function(res){
		
		res.on('data', function(d) {
			var data = JSON.parse(d);
			console.log(data);
		});
		
		res.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
	}).end();
	console.log('Get Weather Fired!');
}

//For testing its sending a get request not post
//Production should 
function postSchedule(){
	options.path = '/api/schedules';
	options.method = 'GET';
	
	http.request(options, function(res){
		
		res.on('data', function(d) {
			var data = JSON.parse(d);
			console.log(data);
		});
		
		res.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
	}).end();
	console.log('GET Schedules Fired!');
}