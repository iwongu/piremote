var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./lib/config')('client-config.json');
var gpio = require('./lib/gpio')(config);

require('./lib/piapp')(config, express, app, __dirname);

var webclients = require('./lib/webclients')(config, io);
var piservers = require('./lib/piservers')(config);
var serial = require('./lib/serial')(config);

webclients
  .on('gpio-write', function(msg) {
    gpio.write(msg.pin, msg.on);
  })
  .on('gpio-read', function(msg) {
    gpio.read(msg.pin, function(value) {
      webclients.broadcast('gpio-value', value);
    });
  })
  .on('serial-write', function(msg) {
    serial.write(msg);
  });
webclients.serve();

piservers
  .on('gpio-write', function(msg) {
    gpio.write(msg.pin, msg.on);
  })
  .on('gpio-read', function(msg) {
    gpio.read(msg.pin, function(value) {
      piservers.broadcast('gpio-value', value);
    });
  })
  .on('serial-write', function(msg) {
    serial.write(msg);
  });
piservers.serve();

serial.serve();

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
