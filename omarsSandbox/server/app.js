var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//lat = 30.627977 & lon = -96.334407
var weather = require('request').defaults({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  json: true
});


var _ = require('lodash');

//Create the application
var app = express();

//Add middleware for REST API's
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

//CORS Support
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use('/hello',function(req, res, next){
	res.send('Hello mySprinkler');
	next();
});
app.use('/we',function(req, res, next){
	var latT = '30.627977', lonT = '-96.334407';
	//append the qs(query string of latitude and longitude)
	weather.get({ qs: { lat: latT, lon: lonT} }, function (error, weatherResponse, body) {
		if (error) return console.log(error);
		db.collection('weathers').insert(body);
		//JSON.stringify(body);
		console.log(body);
	});
	next();
});

//Connect to MongoDB
mongoose.connect('mongodb://localhost/mySprinkler');
var db = mongoose.connection.once('open',function(){

	//Load the models
	app.models = require('./models/index');
	
	//Load the routes
	var routes = require('./routes');
	_.each(routes, function(controller, route){
		app.use(route, controller(app, route));
	});
	
	console.log('listening on port 3000...');
	app.listen(3000);
});