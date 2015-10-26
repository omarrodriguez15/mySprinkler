/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Condweather = require('./condweather.model');

exports.register = function(socket) {
  Condweather.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Condweather.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('condweather:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('condweather:remove', doc);
}