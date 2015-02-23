var EventEmitter = require('events').EventEmitter;
var util = require('util');

var WebClients = function(config, io) {
  this.config = config;
  this.io = io;
  this.clients = {};
};
util.inherits(WebClients, EventEmitter);

WebClients.prototype.serve = function() {
  var thiz = this;
  this.io.of('/client')
    .on('connection', function(socket) {
      console.log('client connected: ' + socket.id);
      thiz.clients[socket.id] = socket;
      socket.on('disconnect', function() {
        console.log('client disconnected: ' + socket.id);
        delete thiz.clients[socket.id];
      });
      socket.on('gpio-write', function(msg) {
        console.log('gpio-write(' + msg.pin + ', ' + msg.on + ')');
        thiz.emit('gpio-write', msg);
      });
      socket.on('gpio-read', function(msg) {
        console.log('gpio-read(' + msg.pin + ')');
        thiz.emit('gpio-read', msg);
      });
      socket.on('gpio-direction', function(msg) {
        console.log('gpio-direction(' + msg.pin + ', ' + msg.dir + ')');
        thiz.emit('gpio-direction', msg);
      });
      socket.on('serial-write', function(msg) {
        console.log('serial-write(' + msg + ')');
        thiz.emit('serial-write', msg);
      });
    });
};

WebClients.prototype.broadcast = function(event, msg) {
  for (var client in this.clients) {
    this.clients[client].emit(event, msg);
  }
};

module.exports = function(config, io) {
  return new WebClients(config, io);
};
