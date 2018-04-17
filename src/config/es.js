const DefaultPreset = require('../utils/preset/DefaultPreset');

module.exports = (command, options, raw) =>
  new DefaultPreset(command, options, raw).export();
