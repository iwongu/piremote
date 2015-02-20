function GPIO() {
}

GPIO.prototype.write = function(pin, on) {
  console.log('GPIO.write(' + pin + ', ' + on + ')');
}

module.exports = new GPIO();
