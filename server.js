var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('server-config.json'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var webclients = require('./lib/webclients')(config, io);
var piclients = require('./lib/piclients')(config, io);

webclients
  .on('gpio-write', function(msg) {
    piclients.broadcast('gpio-write', msg);
  })
  .on('gpio-read', function(msg) {
    piclients.broadcast('gpio-read', msg);
  })
  .on('gpio-direction', function(msg) {
    piclients.broadcast('gpio-direction', msg);
  })
  .on('serial-write', function(msg) {
    piclients.broadcast('gpio-write', msg);
  });
webclients.serve();

piclients
  .on('gpio-value', function(msg) {
    webclients.broadcast('gpio-value', msg);
  })
piclients.serve();

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
