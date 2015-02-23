var gpio = require('pi-gpio');

function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
  gpio.getDirection(pin, function(err, dir) {
    if (dir == 'out') {
      gpio.open(pin, 'output', function(err) {
        gpio.write(pin, on ? 1 : 0, function(err) {
          gpio.close(pin);
        });
      });
    }
  });
}

GPIO.prototype.read = function(pin, callback) {
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
}

GPIO.prototype.direction = function(pin, dir, callback) {
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

module.exports = new GPIO();
