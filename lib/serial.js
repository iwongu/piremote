var EventEmitter = require('events').EventEmitter;
var SerialPort = require("serialport").SerialPort
var util = require('util');

var Serial = function(config) {
  this.config = config;
  if (this.config.serial) {
    this.port = new SerialPort(config.serial);
  } else {
    console.log('serial port not configured');
  }
};
util.inherits(Serial, EventEmitter);

Serial.prototype.serve = function() {
  if (!this.port) { return; }
  var thiz = this;
  this.port
    .on("open", function () {
      console.log('open');
    })
    .on('close', function(data) {
      console.log('close');
    })
    .on('error', function(err) {
      console.log('error: ' + err);
    })
    .on('data', function(data) {
      console.log('data received: ' + data);
    });
};

Serial.prototype.write = function(msg) {
  if (!this.port) { return; }
  this.port.write(msg, function(err) {
    if (err) {
      console.log('err ' + err);
    }
  });
};

module.exports = function(config) {
  return new Serial(config);
};
