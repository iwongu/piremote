var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('server-config.json'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var clients = {};
var pis = {};

// from browsers.
io.of('/client')
  .on('connection', function(socket) {
    console.log('client connected: ' + socket.id);
    clients[socket.id] = socket;
    socket.on('disconnect', function() {
      console.log('client disconnected: ' + socket.id);
      delete clients[socket.id];
    });
    socket.on('gpio-write', function(msg) {
      console.log('gpio-write(' + msg.pin + ', ' + msg.on + ')');
      for (pi in pis) {
        pis[pi].emit('gpio-write', msg);
      }
    });
    socket.on('gpio-read', function(msg) {
      console.log('gpio-read(' + msg.pin + ')');
      for (pi in pis) {
        pis[pi].emit('gpio-read', msg);
      }
    });
    socket.on('serial-write', function(msg) {
      console.log('serial-write(' + msg + ')');
      for (pi in pis) {
        pis[pi].emit('serial-write', msg);
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
    socket.on('gpio-value', function(msg) {
      console.log('gpio-value(' + msg.pin + ', ' + msg.on + ', ' + msg.dir + ')');
      for (client in clients) {
        clients[client].emit('gpio-value', msg);
      }
    });
  });

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
