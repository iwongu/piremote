function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
}

GPIO.prototype.read = function(pin, callback) {
  var r = Math.round(Math.random() * 100);
  setTimeout(function() {
    callback({
      pin: pin,
      on: r % 2 == 0,
      dir: (r % 3 == 0) ? 'in' : 'out'
    });
  }, 500);
}

GPIO.prototype.direction = function(pin, dir, callback) {
  setTimeout(function() {
    callback({
      pin: pin,
      on: true,
      dir: dir
    });
  }, 500);
}

module.exports = new GPIO();
