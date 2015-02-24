var GPIO = function() {
  this.gpio = require('pi-gpio');
};

GPIO.prototype.write = function(pin, on) {
  var gpio = this.gpio;
  gpio.open(pin, 'out', function(err) {
    gpio.write(pin, on ? 1 : 0, function(err) {
      gpio.close(pin);
    });
  });
};

GPIO.prototype.read = function(pin, callback) {
  var gpio = this.gpio;
  gpio.open(pin, 'in', function(err) {
    gpio.read(pin, function(err, value) {
      gpio.close(pin);
      callback({pin: pin, on: value});
    });
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

module.exports = function(config) {
  return config.nogpio ? new GPIODebug() : new GPIO();
};
