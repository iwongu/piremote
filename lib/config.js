var extend = require('extend');
var fs = require('fs');

var Configs = function(config_file) {
  extend(this, JSON.parse(fs.readFileSync('config.json')));
  extend(this, JSON.parse(fs.readFileSync(config_file)));
};

module.exports = function(config_file) {
  return new Configs(config_file);
};
