var EventEmitter = require('events').EventEmitter;
var util = require('util');

var PiClients = function(config, io) {
  this.config = config;
  this.io = io;
  this.pis = {};
};
util.inherits(PiClients, EventEmitter);

PiClients.prototype.serve = function() {
  var thiz = this;
  this.io.of('/pi').on('connection', function(socket) {
    console.log('pi connected: ' + socket.id);
    thiz.pis[socket.id] = socket;
    socket.on('disconnect', function() {
      console.log('pi disconnected: ' + socket.id);
      delete thiz.pis[socket.id];
    });
    socket.on('gpio-value', function(msg) {
      console.log('gpio-value(' + msg.pin + ', ' + msg.on + ', ' + msg.dir + ')');
      thiz.emit('gpio-value', msg);
    });
  });
};

PiClients.prototype.broadcast = function(event, msg) {
  for (var pi in this.pis) {
    this.pis[pi].emit(event, msg);
  }
};

module.exports = function(config, io) {
  return new PiClients(config, io);
};
