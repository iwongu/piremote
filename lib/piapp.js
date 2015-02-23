module.exports = function(config, express, app, dirname) {
  app.get('/', function(req, res) {
    res.sendFile(dirname + '/' + config.pimodel + '.html');
  });
  app.use('/static', express.static(dirname + '/static'));
};
