console.log('loaded...');
var socket = io.connect('/client');

var refreshAll = function() {
  $('.gpio').each(function() {
    var pin = parseInt($(this).text(), 10);
    console.log('gpio-read(' + pin + ')');
    socket.emit('gpio-read', {pin: pin});
  });
};
$('.gpio').each(function() {
  $(this).bind('click', function() {
    var pin = parseInt($(this).text(), 10);
    var dir = $('div[value=' + pin + ']').text().toLowerCase();
    if (dir == 'out') {
      var onoff = !$(this).hasClass('onoff');
      console.log('gpio-write(' + pin + ', ' + onoff + ')');
      socket.emit('gpio-write', {pin: pin, on: onoff});
      $(this).toggleClass('onoff');
    }
  });
});
$('.pindir').each(function() {
  $(this).bind('click', function() {
    var pin = parseInt($(this).attr('value'), 10);
    var dir = $(this).text().toLowerCase();
    dir = dir == 'in' ? 'out' : 'in';
    console.log('gpio-direction(' + pin + ', ' + dir + ')');
    socket.emit('gpio-direction', {pin: pin, dir: dir});
  });
});
$('.refresh').bind('click', refreshAll);

socket
  .on('connect', function() {
    console.log('connect');
    refreshAll();
  })
  .on('gpio-value', function(msg) {
    $('.gpio').each(function() {
      var pin = parseInt($(this).text(), 10);
      if (msg.pin == pin) {
        if (msg.dir == 'out') {
          $(this).addClass('out');
          $(this).removeClass('onoff');
        } else {
          $(this).removeClass('out');
          if (msg.on) {
            $(this).addClass('onoff');
          } else {
            $(this).removeClass('onoff');
          }
        }
        $('div[value=' + pin + ']').text(msg.dir.toUpperCase());
      }
    });
  });
