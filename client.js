var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var gpio = require('./gpio-debug');
var gpio = require('./gpio');

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
var socket = require('socket.io-client')('http://localhost:3000/pi');
socket.on('connect', function(){
  console.log('connect');
});
socket.on('disconnect', function(){
  console.log('disconnect');
});
socket.on('write', function(msg) {
  gpio.write(msg.pin, msg.on);
});

server.listen(4000, function() {
  console.log('listening on *:4000');
});
