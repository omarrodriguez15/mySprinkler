/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var RawWeather = require('./rawWeather.model');

exports.register = function(socket) {
  RawWeather.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  RawWeather.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('rawWeather:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('rawWeather:remove', doc);
}