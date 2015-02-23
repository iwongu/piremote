function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
}

GPIO.prototype.read = function(pin, callback) {
  setTimeout(function() {
    callback(Math.random() < .5);
  }, 500);
}

module.exports = new GPIO();
