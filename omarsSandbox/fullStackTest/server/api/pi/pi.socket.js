/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pi = require('./pi.model');

exports.register = function(socket) {
  Pi.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pi.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pi:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pi:remove', doc);
}