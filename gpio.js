var gpio = require('pi-gpio');

function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
  gpio.open(pin, "output", function(err) {
    gpio.write(pin, on ? 1 : 0, function() {
        gpio.close(pin);
    });
  });
}

module.exports = new GPIO();
