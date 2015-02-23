var GPIO = function() {
  this.gpio = require('pi-gpio');
};

GPIO.prototype.write = function(pin, on) {
  var gpio = this.gpio;
  gpio.getDirection(pin, function(err, dir) {
    if (dir == 'out') {
      gpio.open(pin, 'output', function(err) {
        gpio.write(pin, on ? 1 : 0, function(err) {
          gpio.close(pin);
        });
      });
    }
  });
};

GPIO.prototype.read = function(pin, callback) {
  var gpio = this.gpio;
  gpio.getDirection(pin, function(err, dir) {
    if (dir == 'in') {
      gpio.open(pin, 'input', function(err) {
        gpio.read(pin, function(err, value) {
          gpio.close(pin);
          callback({pin: pin, on: value, dir: dir});
        });
      });
    } else {
      callback({pin: pin, dir: dir});
    }
  });
};

GPIO.prototype.direction = function(pin, dir, callback) {
  var gpio = this.gpio;
  gpio.setDirection(pin, dir, function(err) {
    if (dir == 'in') {
      gpio.open(pin, 'input', function(err) {
        gpio.read(pin, function(err, value) {
          gpio.close(pin);
          callback({pin: pin, on: value, dir: dir});
        });
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
