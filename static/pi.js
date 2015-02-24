console.log('loaded...');
var socket = io.connect('/client');

$('.gpio').each(function() {
  $(this).bind('click', function() {
    var pin = parseInt($(this).text(), 10);
    var dir = $('div[value=' + pin + ']').text();
    if (dir == 'out') {
      var onoff = !$(this).hasClass('onoff');
      console.log('gpio-write(' + pin + ', ' + onoff + ')');
      socket.emit('gpio-write', {pin: pin, on: onoff});
      $(this).toggleClass('onoff');
    } else {
      console.log('gpio-read(' + pin + ')');
      socket.emit('gpio-read', {pin: pin});
    }
  });
});
$('.pindir').each(function() {
  $(this).bind('click', function() {
    var pin = parseInt($(this).attr('value'), 10);
    var dir = $(this).text();
    dir = dir == 'in' ? 'out' : 'in';
    $(this).text(dir);
    if (dir == 'in') {
      console.log('gpio-read(' + pin + ')');
      socket.emit('gpio-read', {pin: pin});
    }
  });
});

socket
  .on('connect', function() {
    console.log('connect');
  })
  .on('gpio-value', function(msg) {
    $('.gpio').each(function() {
      var pin = parseInt($(this).text(), 10);
      if (msg.pin == pin) {
        if (msg.on) {
          $(this).addClass('onoff');
        } else {
          $(this).removeClass('onoff');
        }
      }
    });
  });
