'use strict';

var _ = require('lodash');
var Pi = require('./pi.model');

// Get list of pis
exports.index = function(req, res) {
  Pi.find(function (err, pis) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pis);
  });
};

// Get a single pi
exports.show = function(req, res) {
  Pi.findById(req.params.id, function (err, pi) {
    if(err) { return handleError(res, err); }
    if(!pi) { return res.status(404).send('Not Found'); }
    return res.json(pi);
  });
};

// Creates a new pi in the DB.
exports.create = function(req, res) {
  Pi.create(req.body, function(err, pi) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pi);
  });
};

// Creates a new pi in the DB.
exports.email = function(req, res) {
  console.log(req.body);
  if(Object.keys(req.body).length !== 0) {
    var email = req.body.email;
    var body = req.body.body;

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mysprinklerservices@gmail.com', // Your email id
        pass: 'mysprinkler1234' // Your password
      }
    });
      
    var mailOptions = {
        from: '<mysprinklerservices@gmail.com>', // sender address
        to: '<' + email + '>', // list of receivers
        subject: 'Schedule Confirmation', // Subject line
        text: body // Plain-text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        }
    });
  }

  return res;
}
// Updates an existing pi in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pi.findById(req.params.id, function (err, pi) {
    if (err) { return handleError(res, err); }
    if(!pi) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pi, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pi);
    });
  });
};



// Deletes a pi from the DB.
exports.destroy = function(req, res) {
  Pi.findById(req.params.id, function (err, pi) {
    if(err) { return handleError(res, err); }
    if(!pi) { return res.status(404).send('Not Found'); }
    pi.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}