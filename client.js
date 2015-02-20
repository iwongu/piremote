var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('client-config.json'));
var gpio = config.nogpio ? require('./gpio-debug') : require('./gpio');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// from browsers.
io.of('/client').
  on('connection', function(socket) {
    console.log('user connected: ' + socket.id);
    socket.on('disconnect', function() {
      console.log('user disconnected: ' + socket.id);
    });
    socket.on('write', function(msg) {
      gpio.write(msg.pin, msg.on);
    });
  });

// from server.
var socket = require('socket.io-client')(config.server + '/pi');
socket.on('connect', function(){
  console.log('connect');
});
socket.on('disconnect', function(){
  console.log('disconnect');
});
socket.on('write', function(msg) {
  gpio.write(msg.pin, msg.on);
});

// for serial port.
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(config.serial);

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write("1", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});