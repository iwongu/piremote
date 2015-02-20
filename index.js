var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require('./gpio-debug');
//var gpio = require('./gpio');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('user connected: ' + socket.id);
  socket.on('disconnect', function() {
    console.log('user disconnected: ' + socket.id);
  });
  socket.on('write', function(msg) {
    gpio.write(msg.pin, msg.on);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
