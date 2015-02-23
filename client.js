var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('client-config.json'));
var gpio = config.nogpio ? require('./lib/gpio-debug') : require('./lib/gpio');

var SerialPort = require("serialport").SerialPort

var servers = {};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var webclients = require('./lib/webclients')(config, io);
webclients
  .on('gpio-write', function(msg) {
    gpio.write(msg.pin, msg.on);
  })
  .on('gpio-read', function(msg) {
    gpio.read(msg.pin, function(value) {
      webclients.broadcast('gpio-value', value);
    });
  })
  .on('gpio-direction', function(msg) {
    gpio.direction(msg.pin, msg.dir, function(value) {
      webclients.broadcast('gpio-value', value);
    });
  })
  .on('serial-write', function(msg) {
    serialPort.write(msg, function(err) {
      if (err) {
        console.log('err ' + err);
      }
    });
  });
webclients.serve();

var piservers = require('./lib/piservers')(config);
piservers
  .on('gpio-write', function(msg) {
    gpio.write(msg.pin, msg.on);
  })
  .on('gpio-direction', function(msg) {
    gpio.direction(msg.pin, msg.dir, function(value) {
      piservers.broadcast('gpio-value', value);
    });
  })
  .on('gpio-read', function(msg) {
    gpio.read(msg.pin, function(value) {
      piservers.broadcast('gpio-value', value);
    });
  })
  .on('serial-write', function(msg) {
    serialPort.write(msg, function(err) {
      if (err) {
        console.log('err ' + err);
      }
    });
  });
piservers.serve();

// for serial port.
if (config.serial) {
  var serialPort = new SerialPort(config.serial);
  serialPort.on("open", function () {
    console.log('open');
    serialPort.on('close', function(data) {
      console.log('close');
    });
    serialPort.on('error', function(err) {
      console.log('error: ' + err);
    });
    serialPort.on('data', function(data) {
      console.log('data received: ' + data);
    });
  });
}

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
