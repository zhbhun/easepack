const DefaultPreset = require('./DefaultPreset');

module.exports = (command, options, raw) =>
  new DefaultPreset(command, options, raw).export();
