var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var socket = require('socket.io-client')('http://localhost:9000');
var methodOverride = require('method-override');
var _ = require('lodash');
var services = require('./components/service');

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
	services.beginTimer();
	next();
});

/*socket.on('connect', function(){
	console.log('Pong');
})*/

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