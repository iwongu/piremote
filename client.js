var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('client-config.json'));
var gpio = config.nogpio ? require('./gpio-debug') : require('./gpio');

var SerialPort = require("serialport").SerialPort

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var clients = {};
var servers = {};

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
      gpio.write(msg.pin, msg.on);
    });
    socket.on('gpio-read', function(msg) {
      console.log('gpio-read(' + msg.pin + ')');
      gpio.read(msg.pin, function(value) {
        for (client in clients) {
          clients[client].emit('gpio-value', value);
        }
      });
    });
    socket.on('gpio-direction', function(msg) {
      console.log('gpio-direction(' + msg.pin + ', ' + msg.dir + ')');
      gpio.direction(msg.pin, msg.dir, function(value) {
        for (client in clients) {
          clients[client].emit('gpio-value', value);
        }
      });
    });
    socket.on('serial-write', function(msg) {
      console.log('serial-write(' + msg + ')');
      serialPort.write(msg, function(err) {
        if (err) {
          console.log('err ' + err);
        }
      });
    });
  });

// from server.
var socket = require('socket.io-client')(config.server + '/pi');
socket.on('connect', function() {
  console.log('connect');
  servers[socket.id] = socket;
});
socket.on('disconnect', function() {
  console.log('disconnect');
  delete servers[socket.id];
});
socket.on('gpio-write', function(msg) {
  console.log('gpio-write(' + msg.pin + ', ' + msg.on + ')');
  gpio.write(msg.pin, msg.on);
});
socket.on('gpio-direction', function(msg) {
  console.log('gpio-direction(' + msg.pin + ', ' + msg.dir + ')');
  gpio.direction(msg.pin, msg.dir, function(value) {
    for (server in servers) {
      servers[server].emit('gpio-value', value);
    }
  });
});
socket.on('gpio-read', function(msg) {
  console.log('gpio-read(' + msg.pin + ')');
  gpio.read(msg.pin, function(value) {
    for (server in servers) {
      servers[server].emit('gpio-value', value);
    }
  });
});
socket.on('serial-write', function(msg) {
  console.log('serial-write: ' + msg);
  serialPort.write(msg, function(err) {
    if (err) {
      console.log('err ' + err);
    }
  });
});

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
