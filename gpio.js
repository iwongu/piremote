var gpio = require('pi-gpio');

function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
  gpio.open(pin, "output", function(err) {
    gpio.write(pin, on ? 1 : 0, function(err) {
      gpio.close(pin);
    });
  });
}

GPIO.prototype.read = function(pin, callback) {
  gpio.open(pin, "input", function(err) {
    gpio.read(pin, function(err, value) {
      gpio.close(pin);
      callback(value);
    });
  });
}

module.exports = new GPIO();
