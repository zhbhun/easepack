const DefaultPreset = require('../utils/preset/DefaultPreset');

module.exports = (options, raw) => new DefaultPreset(options, raw).export();
