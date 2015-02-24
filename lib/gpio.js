var GPIO = function() {
  this.gpio = require('pi-gpio');
  this.opened = [];

  process.on('SIGINT', function() {
    console.log('gracefully shutting down from SIGINT (Ctrl-C)');
    for (var o in this.opend) {
      this.gpio.close(opened);
    }
    process.exit( );
  });
};

// dir is used only if the pin is not opened yet.
GPIO.prototype._open = function(pin, dir) {
  if (this.opened.indexOf(pin) > -1) {
    return;
  }
  this.opened.push(pin);
  gpio.open(pin, dir, function(err) {
    if (err) {console.log(err);}
  });
};

GPIO.prototype.write = function(pin, on) {
  var gpio = this.gpio;
  this._open(pin, 'out');
  gpio.getDirection(pin, function(err, dir) {
    if (err) {console.log(err);}
    if (dir == 'out') {
      gpio.write(pin, on ? 1 : 0, function(err) {
        if (err) {console.log(err);}
      });
    }
  });
};

GPIO.prototype.read = function(pin, callback) {
  var gpio = this.gpio;
  this._open(pin, 'in');
  gpio.getDirection(pin, function(err, dir) {
    if (err) {console.log(err);}
    if (dir == 'in') {
      gpio.read(pin, function(err, value) {
        if (err) {console.log(err);}
        callback({pin: pin, on: value, dir: dir});
      });
    } else {
      callback({pin: pin, dir: dir});
    }
  });
};

GPIO.prototype.direction = function(pin, dir, callback) {
  var gpio = this.gpio;
  this._open(pin, dir);
  gpio.setDirection(pin, dir, function(err) {
    if (err) {console.log(err);}
    if (dir == 'in') {
      gpio.read(pin, function(err, value) {
        if (err) {console.log(err);}
        callback({pin: pin, on: value, dir: dir});
      });
    } else {
      callback({pin: pin, dir: dir});
    }
  });
};

var GPIODebug = function() {
}

GPIODebug.prototype.write = function(pin, on) {
}

GPIODebug.prototype.read = function(pin, callback) {
  var r = Math.round(Math.random() * 100);
  setTimeout(function() {
    callback({
      pin: pin,
      on: r % 2 == 0,
      dir: (r % 3 == 0) ? 'in' : 'out'
    });
  }, 500);
}

GPIODebug.prototype.direction = function(pin, dir, callback) {
  setTimeout(function() {
    callback({
      pin: pin,
      on: true,
      dir: dir
    });
  }, 500);
}

module.exports = function(config) {
  return config.nogpio ? new GPIODebug() : new GPIO();
};
