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
