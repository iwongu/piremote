var EventEmitter = require('events').EventEmitter;
var util = require('util');

var PiServers = function(config) {
  this.config = config;
  this.socket = require('socket.io-client')(config.server + '/pi');
  this.servers = {};
};
util.inherits(PiServers, EventEmitter);

PiServers.prototype.serve = function() {
  var thiz = this;
  this.socket
    .on('connect', function() {
      console.log('connect');
      thiz.servers[thiz.socket.id] = thiz.socket;
    })
    .on('disconnect', function() {
      console.log('disconnect');
      delete thiz.servers[thiz.socket.id];
    })
    .on('gpio-write', function(msg) {
      console.log('gpio-write(' + msg.pin + ', ' + msg.on + ')');
      thiz.emit('gpio-write', msg);
    })
    .on('gpio-direction', function(msg) {
      console.log('gpio-direction(' + msg.pin + ', ' + msg.dir + ')');
      thiz.emit('gpio-direction', msg);
    })
    .on('gpio-read', function(msg) {
      console.log('gpio-read(' + msg.pin + ')');
      thiz.emit('gpio-read', msg);
    })
    .on('serial-write', function(msg) {
      console.log('serial-write: ' + msg);
      thiz.emit('serial-write', msg);
      serialPort.write(msg, function(err) {
        if (err) {
          console.log('err ' + err);
        }
      });
    });
};

PiServers.prototype.broadcast = function(event, msg) {
  for (var server in this.servers) {
    this.servers[server].emit(event, msg);
  }
};

module.exports = function(config) {
  return new PiServers(config);
};
