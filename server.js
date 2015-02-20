var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var gpio = require('./gpio-debug');
//var gpio = require('./gpio');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var pis = {};

// from browsers.
io.of('/client')
  .on('connection', function(socket) {
    console.log('client connected: ' + socket.id);
    socket.on('disconnect', function() {
      console.log('client disconnected: ' + socket.id);
    });
    socket.on('write', function(msg) {
      console.log('write(' + msg.pin + ', ' + msg.on + ')');
      for (pi in pis) {
        pis[pi].emit('write', msg);
      }
    });
  });

// from pi.
io.of('/pi')
  .on('connection', function(socket) {
    console.log('pi connected: ' + socket.id);
    pis[socket.id] = socket;
    socket.on('disconnect', function() {
      console.log('pi disconnected: ' + socket.id);
      delete pis[socket.id];
    });
  });

server.listen(3000, function() {
  console.log('listening on *:3000');
});
