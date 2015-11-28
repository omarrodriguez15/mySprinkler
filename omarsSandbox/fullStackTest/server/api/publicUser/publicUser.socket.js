/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var PublicUser = require('./publicUser.model');

exports.register = function(socket) {
  PublicUser.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  PublicUser.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('publicUser:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('publicUser:remove', doc);
}