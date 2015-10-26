'use strict';

var config = require('../config/local.env');
var mongoose = require('mongoose');
var scheduleSchema = require('../models/schedule');
var schedule = mongoose.model('schedule', scheduleSchema);
var http = require('http');

module.exports = {
	beginTimer : function(){
		//3600000 miliseconds is an hour
		setInterval(postSchedule, 5000);
	},
	sendIp : function(){
		return 'send Ip';
	},
	getWeather: function(){
		return 'get weather';
	},
	sendSn : function(){
		return 'send serial number';
	} 
};

function postIp(){
	
}

function getWeather(){
	
}

function postSchedule(){
	var options = {
	//defaulted to hostnam at port 80
	port: config.options.port || 9000,
	path: '/api/schedules',
	method: 'GET'
	};
	
	http.request(options, function(res){
		
		res.on('data', function(d) {
			var data = JSON.parse(d);
			console.log(data);
		});
		
		res.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
	}).end();
	console.log('Send Info Fired!');
}