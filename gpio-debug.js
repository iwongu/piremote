function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
}

GPIO.prototype.read = function(pin, callback) {
  setTimeout(function() {
    callback({pin: pin, on: Math.random() < .5, dir: 'out'});
  }, 500);
}

module.exports = new GPIO();
