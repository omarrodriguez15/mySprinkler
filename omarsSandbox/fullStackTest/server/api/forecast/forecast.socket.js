/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Forecast = require('./forecast.model');

exports.register = function(socket) {
  Forecast.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Forecast.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('forecast:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('forecast:remove', doc);
}