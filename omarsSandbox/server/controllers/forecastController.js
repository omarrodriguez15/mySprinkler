 var restful = require('node-restful');

module.exports = function(app, route){
	//setup the controller
	var rest = restful.model(
	    'forecast',
	    app.models.forecast
	    ).methods(['get','put','post','delete']);

	//regesiter this endpoint with the application
	rest.register(app, route);
	
	//return middleware
	return function(req,res,next){
	  next();
	};
};
